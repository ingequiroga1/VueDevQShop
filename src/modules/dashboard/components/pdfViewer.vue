<template>
    <div ref="pdfContainer" class="pdf-container">
        <canvas ref="canvas"></canvas>
    </div>
    <button @click="printPdf">Imprimir</button>
</template>

<script setup lang="ts">
import {onMounted, ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import generarPdf from '../../../helpers/generarPdfHelper.ts';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const pdfContainer = ref<HTMLCanvasElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const loadPdf = async () =>{
    
    
    const url = generarPdf();
    const pdfUrl = URL.createObjectURL(url);

    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({scale: 1.5 });

        if (canvas.value) {
            const context: CanvasRenderingContext2D | null = canvas.value.getContext('2d');

            if (context) { //verifica que context no sea null antes de usarlo 

                canvas.value.height = 700;
                canvas.value.width = 500;


                await page.render({
                canvasContext: context,
                viewport: viewport,
                }).promise;  
            }else{
                console.log("No se puede obtener el contexto 2d de canvas");
                
            }
        }
    } catch (error) {
        console.log("Error al cargar el pdf:", error)
        
    }finally{
        URL.revokeObjectURL(pdfUrl);
    }
};

onMounted(() => {
    loadPdf();
});

//Imprimir pdf renderizado
const printPdf = () => {
    const printWindow = window.open('','_blank');

    if (printWindow) {
        printWindow.document.write('<html><head><title> Imprimir PDF </title></head><body>');
        printWindow.document.write(pdfContainer.value.innerHTML);
        printWindow.document.write('</body></html>');

        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    }
}

</script>

<style scoped>

.pdf-container{
    width: 100%;
    height: 500px;
    position: relative;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
}

</style>