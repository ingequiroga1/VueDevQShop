<template>
      <div 
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"    
     >
     <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <div>
            <!-- <embed :src="pdfUrl || undefined" type="application/pdf" style="width:100%; height:30rem;" /> -->
            <PdfViewer />
        </div>
        <div class="flex flex-row-reverse mt-6 gap-2">
            <button
                @click="$emit('close')"
                class="bg-red-500 text-white font-bold py-2 px-4 rounded"
                >Cerrar
            </button>
        </div>
     </div>
     </div>
</template>

<script setup lang="ts">
import PdfViewer from '../components/pdfViewer.vue'
// import generarPdf from '../../../helpers/generarPdfHelper.ts'

// const pdfUrl = ref<string | null>(null); //Permite string o null
// // let blobGenerado = generarPdf()
// let objpdf = generarPdf();
// const 
// pdfUrl.value = 'data:application/pdf;base64,' + objpdf
// pdfUrl.value = URL.createObjectURL(blobGenerado)

</script>