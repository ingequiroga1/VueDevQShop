import jsPDF from "jspdf";

const generarPdf = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(16)
    doc.text("Datos de la venta",10,20)
    doc.save('reporte.pdf')
}  

export default generarPdf