import jsPDF from "jspdf";

const generarPdf = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(16)
    doc.text("Hola este es un PDF generado!",10,20)

     const pdfBlob = doc.output('blob')
     return pdfBlob
}  

export default generarPdf