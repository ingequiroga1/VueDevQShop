import jsPDF from "jspdf";
import { ProductoPeticion } from "../interfaces/Producto";

const generarPdf = (productos:ProductoPeticion[]) => {
    
    const doc = new jsPDF()
    let y = 20;
    let total = 0;

    doc.setFont("helvetica", "bold");
    doc.text("Recibo de venta", 105, 10, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Date: " + new Date().toLocaleDateString(), 10, 15);

    doc.text("Producto", 10, y);
    doc.text("Cantidad", 90, y);
    doc.text("Precio", 130, y);
    doc.text("Total", 170, y);
    doc.line(10, y + 2, 200, y + 2);

    y += 10;
    productos.forEach((product) => {
        const totalProduct = product.cantidad * product.precio_venta;
        total += totalProduct;
        
        doc.text(product.nombre, 10, y);
        doc.text(String(product.cantidad), 100, y);
        doc.text(`$${product.precio_venta.toFixed(2)}`, 120, y);
        doc.text(`$${totalProduct.toFixed(2)}`, 160, y);
        
        y += 10;
    });
    
    doc.line(10, y, 200, y);
    y += 10;
    doc.text("Total General:", 120, y);
    doc.text(`$${total.toFixed(2)}`, 160, y);
    doc.save('reporte.pdf')
}  

export default generarPdf
