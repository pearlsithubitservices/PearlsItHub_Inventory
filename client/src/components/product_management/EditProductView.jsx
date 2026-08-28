import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { SingleImageUpload, GalleryImageUpload } from "../common/ImageUploader";

const ACCENT = "#1e5fa5";
const ACCENT_2 = "#0a57c4";

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5fa5]/30 focus:border-[#1e5fa5]/30 focus:bg-white transition-all";
const selectCls = `${inputCls} appearance-none pr-8 cursor-pointer`;

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

function productToForm(p) {
  return {
    productName: p.name || "",
    productId: p.productId || "",
    productType: p.productType || "",
    description: p.description || "",
    barcode: p.barcode || "",
    sellInPack: p.sellInPack || "",
    warranty: p.warranty || "",
    productExpiryDate: p.productExpiryDate
      ? p.productExpiryDate.slice(0, 10)
      : "",
    category: p.category || "",
    subCategory: p.subCategory || "",
    brand: p.brand || "",
    hsnSacCode: p.hsnSacCode || "",
    tagForProduct: p.tagForProduct || "",
    perishableProduct: p.perishableProduct || "",
    weightInGm: p.weightInGm ?? "",
    mrp: p.mrp ?? "",
    sizeInCm: p.sizeInCm || "",
    purchasePrice: p.purchasePrice ?? "",
    dateOfManufacture: p.dateOfManufacture
      ? p.dateOfManufacture.slice(0, 10)
      : "",
    mfgLicenseNumber: p.mfgLicenseNumber || "",
    unit: p.unit || "",
    sellingPrice: p.sellingPrice ?? "",
    taxRate: p.taxRate ?? "",
    countryOfOrigin: p.countryOfOrigin || "",
    discount: p.discount ?? "",
    currentStock: p.currentStock ?? p.stock ?? "",
    reorderLevel: p.reorderLevel ?? "",
    warehouseLocation: p.warehouseLocation || "",
    shipmentTime: p.shipmentTime || "",
    warrantyInventory: p.warrantyInventory || "",
    counterfeitProduct: p.counterfeitProduct || "",
    inventoryLocation: p.inventoryLocation || "",
    batchNumber: p.batchNumber || "",
    binLocation: p.binLocation || "",
    region: p.region || "",
    supplierName: p.supplierName || "",
    invoiceNumber: p.invoiceNumber || "",
    lastDate: p.lastDate ? p.lastDate.slice(0, 10) : "",
    supplierLicenseNumber: p.supplierLicenseNumber || "",
    supplierContactNumber: p.supplierContactNumber || "",
    invoiceDate: p.invoiceDate ? p.invoiceDate.slice(0, 10) : "",
    batchId: p.batchId || "",
    manufacturer: p.manufacturer || "",
    color: p.color || "",
    country: p.country || p.countryOfOrigin || "",
    modelName: p.modelName || "",
    material: p.material || "",
    speciality: p.speciality || "",
    tasteFragrance: p.tasteFragrance || "",
    productStatus: p.status === "active" ? "Active" : "Inactive",
    publishOnStore: p.publishOnStore ? "Yes" : "No",
    allowPurchase: p.allowPurchase ? "Yes" : "No",
    allowSales: p.allowSales ? "Yes" : "No",
    productImage: p.imageUrl
      ? { url: p.imageUrl, publicId: p.imagePublicId || "" }
      : null,
    galleryImages: p.galleryImages || [],
  };
}

export default function EditProductView({ product, onBack }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(productToForm(product));
    }
  }, [product]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRadio = (field, value) => () =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        name: form.productName,
        productId: form.productId,
        productType: form.productType,
        description: form.description,
        barcode: form.barcode,
        sellInPack: form.sellInPack,
        warranty: form.warranty,
        productExpiryDate: form.productExpiryDate || undefined,
        category: form.category,
        subCategory: form.subCategory,
        brand: form.brand,
        hsnSacCode: form.hsnSacCode,
        tagForProduct: form.tagForProduct,
        perishableProduct: form.perishableProduct,
        weightInGm: form.weightInGm ? Number(form.weightInGm) : undefined,
        mrp: form.mrp ? Number(form.mrp) : undefined,
        sizeInCm: form.sizeInCm,
        purchasePrice: form.purchasePrice
          ? Number(form.purchasePrice)
          : undefined,
        dateOfManufacture: form.dateOfManufacture || undefined,
        mfgLicenseNumber: form.mfgLicenseNumber,
        unit: form.unit,
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : undefined,
        taxRate: form.taxRate ? Number(form.taxRate) : undefined,
        countryOfOrigin: form.countryOfOrigin,
        discount: form.discount ? Number(form.discount) : undefined,
        currentStock: form.currentStock ? Number(form.currentStock) : 0,
        reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : undefined,
        warehouseLocation: form.warehouseLocation,
        shipmentTime: form.shipmentTime,
        warrantyInventory: form.warrantyInventory,
        counterfeitProduct: form.counterfeitProduct,
        inventoryLocation: form.inventoryLocation,
        batchNumber: form.batchNumber,
        binLocation: form.binLocation,
        region: form.region,
        supplierName: form.supplierName,
        invoiceNumber: form.invoiceNumber,
        lastDate: form.lastDate || undefined,
        supplierLicenseNumber: form.supplierLicenseNumber,
        supplierContactNumber: form.supplierContactNumber,
        invoiceDate: form.invoiceDate || undefined,
        batchId: form.batchId,
        manufacturer: form.manufacturer,
        color: form.color,
        country: form.country,
        modelName: form.modelName,
        material: form.material,
        speciality: form.speciality,
        tasteFragrance: form.tasteFragrance,
        status: form.productStatus === "Active" ? "active" : "inactive",
        publishOnStore: form.publishOnStore === "Yes",
        allowPurchase: form.allowPurchase === "Yes",
        allowSales: form.allowSales === "Yes",
        imageUrl: form.productImage?.url || "",
        imagePublicId: form.productImage?.publicId || "",
        galleryImages: form.galleryImages || [],
        stock: form.currentStock ? Number(form.currentStock) : 0,
        price: form.sellingPrice ? Number(form.sellingPrice) : 0,
        cost: form.purchasePrice ? Number(form.purchasePrice) : 0,
        sku:
          form.barcode || form.productId || product?.sku || `PRD-${Date.now()}`,
        minStock: form.reorderLevel ? Number(form.reorderLevel) : 5,
      };

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-1.5 rounded-lg bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="editProductForm"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-white text-sm font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${ACCENT} 100%)`,
            }}
          >
            <Save size={14} /> {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium">
          Product updated successfully!
        </div>
      )}

      <form id="editProductForm" onSubmit={handleSubmit} className="space-y-4">
        {/* Product Information */}
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4">
          <h3 className="text-base font-bold text-slate-900 mb-3">Product Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <Field label="Product Name" required>
              <input
                type="text"
                value={form.productName}
                onChange={handleChange("productName")}
                required
                className={inputCls}
                placeholder="Enter product name"
              />
            </Field>
            <Field label="Barcode" required>
              <input
                type="text"
                value={form.barcode}
                onChange={handleChange("barcode")}
                required
                className={inputCls}
                placeholder="Enter barcode number"
              />
            </Field>
            <Field label="Product ID">
              <input
                type="text"
                value={form.productId}
                onChange={handleChange("productId")}
                className={inputCls}
                placeholder="Enter product ID"
              />
            </Field>
            <Field label="Sell in Pack" required>
              <input
                type="text"
                value={form.sellInPack}
                onChange={handleChange("sellInPack")}
                required
                className={inputCls}
                placeholder="Enter Sell in Pack"
              />
            </Field>
            <Field label="Product Type">
              <input
                type="text"
                value={form.productType}
                onChange={handleChange("productType")}
                className={inputCls}
                placeholder="Enter product type"
              />
            </Field>
            <Field label="Warranty" required>
              <select
                value={form.warranty}
                onChange={handleChange("warranty")}
                required
                className={selectCls}
              >
                <option value="">Select Duration</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
                <option>2 Years</option>
                <option>3 Years</option>
                <option>5 Years</option>
                <option>Lifetime</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder="Describe your product..."
                />
              </Field>
            </div>
            <Field label="Product Expiry Date" required>
              <input
                type="date"
                value={form.productExpiryDate}
                onChange={handleChange("productExpiryDate")}
                required
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        {/* Classification */}
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4">
          <h3 className="text-base font-bold text-slate-900 mb-3">Classification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <Field label="Category" required>
              <select
                value={form.category}
                onChange={handleChange("category")}
                required
                className={selectCls}
              >
                <option value="">All Category</option>
                <option>Electronics</option>
                <option>Furnitures</option>
                <option>Accessories</option>
                <option>Hardwares</option>
                <option>Clothing</option>
                <option>Grocery</option>
              </select>
            </Field>
            <Field label="Sub Category" required>
              <select
                value={form.subCategory}
                onChange={handleChange("subCategory")}
                required
                className={selectCls}
              >
                <option value="">All Sub Category</option>
                <option>Laptops</option>
                <option>Monitors</option>
                <option>Peripherals</option>
                <option>Chairs</option>
                <option>Audio</option>
                <option>Accessories</option>
              </select>
            </Field>
            <Field label="Brand" required>
              <input
                type="text"
                value={form.brand}
                onChange={handleChange("brand")}
                required
                className={inputCls}
                placeholder="Enter brand"
              />
            </Field>
            <Field label="HSN / SAC Code" required>
              <input
                type="text"
                value={form.hsnSacCode}
                onChange={handleChange("hsnSacCode")}
                required
                className={inputCls}
                placeholder="Enter HSN / SAC Code"
              />
            </Field>
            <Field label="Tag for Product" required>
              <input
                type="text"
                value={form.tagForProduct}
                onChange={handleChange("tagForProduct")}
                required
                className={inputCls}
                placeholder="Enter Brand Name"
              />
            </Field>
            <Field label="Perishable Product" required>
              <select
                value={form.perishableProduct}
                onChange={handleChange("perishableProduct")}
                required
                className={selectCls}
              >
                <option value="">Select Yes / No</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>
            <Field label="Weight (in gm)" required>
              <input
                type="number"
                value={form.weightInGm}
                onChange={handleChange("weightInGm")}
                required
                className={inputCls}
                placeholder="Enter weight (gm)"
              />
            </Field>
            <Field label="M.R.P (Rs)" required>
              <input
                type="number"
                value={form.mrp}
                onChange={handleChange("mrp")}
                required
                className={inputCls}
                placeholder="Enter M.R.P"
              />
            </Field>
            <Field label="Size (in cm)" required>
              <input
                type="text"
                value={form.sizeInCm}
                onChange={handleChange("sizeInCm")}
                required
                className={inputCls}
                placeholder="Enter Dimensions"
              />
            </Field>
            <Field label="Purchase Price (Rs)" required>
              <input
                type="number"
                value={form.purchasePrice}
                onChange={handleChange("purchasePrice")}
                required
                className={inputCls}
                placeholder="Enter Purchase Price"
              />
            </Field>
            <Field label="Date of Manufacture" required>
              <input
                type="date"
                value={form.dateOfManufacture}
                onChange={handleChange("dateOfManufacture")}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Mfg License Number" required>
              <input
                type="text"
                value={form.mfgLicenseNumber}
                onChange={handleChange("mfgLicenseNumber")}
                required
                className={inputCls}
                placeholder="Enter License Number"
              />
            </Field>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
          <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-4">
            Pricing Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
            <Field label="Unit" required>
              <select
                value={form.unit}
                onChange={handleChange("unit")}
                required
                className={selectCls}
              >
                <option value="">Select Unit</option>
                <option>NOS</option>
                <option>Box</option>
                <option>Kg</option>
                <option>Liter</option>
                <option>Set</option>
                <option>Pack</option>
                <option>Piece</option>
              </select>
            </Field>
            <Field label="Country Of Origin" required>
              <input
                type="text"
                value={form.countryOfOrigin}
                onChange={handleChange("countryOfOrigin")}
                required
                className={inputCls}
                placeholder="Enter Country of Origin"
              />
            </Field>
            <Field label="Selling Price (Rs)" required>
              <input
                type="number"
                value={form.sellingPrice}
                onChange={handleChange("sellingPrice")}
                required
                className={inputCls}
                placeholder="Enter Selling Price"
              />
            </Field>
            <Field label="Discount">
              <input
                type="number"
                value={form.discount}
                onChange={handleChange("discount")}
                className={inputCls}
                placeholder="Enter Discount"
              />
            </Field>
            <Field label="Tax Rate" required>
              <input
                type="number"
                value={form.taxRate}
                onChange={handleChange("taxRate")}
                required
                className={inputCls}
                placeholder="Enter Tax Rate"
              />
            </Field>
          </div>
        </div>

        {/* Inventory & Warehouse Information */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
          <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-4">
            Inventory & Warehouse Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
            <Field label="Current Stock" required>
              <input
                type="number"
                value={form.currentStock}
                onChange={handleChange("currentStock")}
                required
                className={inputCls}
                placeholder="Enter available quantity"
              />
            </Field>
            <Field label="Counterfeit Product" required>
              <input
                type="text"
                value={form.counterfeitProduct}
                onChange={handleChange("counterfeitProduct")}
                required
                className={inputCls}
                placeholder="Enter counterfeit product"
              />
            </Field>
            <Field label="Reorder Level" required>
              <input
                type="number"
                value={form.reorderLevel}
                onChange={handleChange("reorderLevel")}
                required
                className={inputCls}
                placeholder="Enter reorder level"
              />
            </Field>
            <Field label="Inventory Location" required>
              <input
                type="text"
                value={form.inventoryLocation}
                onChange={handleChange("inventoryLocation")}
                required
                className={inputCls}
                placeholder="Enter inventory location"
              />
            </Field>
            <Field label="Warehouse Location" required>
              <input
                type="text"
                value={form.warehouseLocation}
                onChange={handleChange("warehouseLocation")}
                required
                className={inputCls}
                placeholder="Enter warehouse location"
              />
            </Field>
            <Field label="Batch Number" required>
              <input
                type="text"
                value={form.batchNumber}
                onChange={handleChange("batchNumber")}
                required
                className={inputCls}
                placeholder="Enter batch number"
              />
            </Field>
            <Field label="Shipment Time" required>
              <input
                type="text"
                value={form.shipmentTime}
                onChange={handleChange("shipmentTime")}
                required
                className={inputCls}
                placeholder="Enter Shipment Time"
              />
            </Field>
            <Field label="Bin Location" required>
              <input
                type="text"
                value={form.binLocation}
                onChange={handleChange("binLocation")}
                required
                className={inputCls}
                placeholder="Enter Bin Location"
              />
            </Field>
            <Field label="Warranty" required>
              <select
                value={form.warrantyInventory}
                onChange={handleChange("warrantyInventory")}
                required
                className={selectCls}
              >
                <option value="">Select Duration</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
                <option>2 Years</option>
                <option>3 Years</option>
              </select>
            </Field>
            <Field label="Region" required>
              <select
                value={form.region}
                onChange={handleChange("region")}
                required
                className={selectCls}
              >
                <option value="">Select region</option>
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
                <option>Central</option>
                <option>Northeast</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Supplier Information */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
          <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-4">
            Supplier Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
            <Field label="Supplier Name" required>
              <input
                type="text"
                value={form.supplierName}
                onChange={handleChange("supplierName")}
                required
                className={inputCls}
                placeholder="Enter supplier name"
              />
            </Field>
            <Field label="Supplier Contact Number" required>
              <input
                type="tel"
                value={form.supplierContactNumber}
                onChange={handleChange("supplierContactNumber")}
                required
                className={inputCls}
                placeholder="Enter supplier contact number"
              />
            </Field>
            <Field label="Invoice Number" required>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={handleChange("invoiceNumber")}
                required
                className={inputCls}
                placeholder="Enter Invoice Number"
              />
            </Field>
            <Field label="Invoice Date" required>
              <input
                type="date"
                value={form.invoiceDate}
                onChange={handleChange("invoiceDate")}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Last Date" required>
              <input
                type="date"
                value={form.lastDate}
                onChange={handleChange("lastDate")}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Batch ID" required>
              <input
                type="text"
                value={form.batchId}
                onChange={handleChange("batchId")}
                required
                className={inputCls}
                placeholder="Enter Batch ID"
              />
            </Field>
            <Field label="License Number" required>
              <input
                type="text"
                value={form.supplierLicenseNumber}
                onChange={handleChange("supplierLicenseNumber")}
                required
                className={inputCls}
                placeholder="Enter License Number"
              />
            </Field>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(10,37,64,0.04)] p-5">
          <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-4">
            Product Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
            <Field label="Manufacturer" required>
              <input
                type="text"
                value={form.manufacturer}
                onChange={handleChange("manufacturer")}
                required
                className={inputCls}
                placeholder="Enter manufacturer"
              />
            </Field>
            <Field label="Model Name" required>
              <input
                type="text"
                value={form.modelName}
                onChange={handleChange("modelName")}
                required
                className={inputCls}
                placeholder="Enter model name"
              />
            </Field>
            <Field label="Color" required>
              <input
                type="text"
                value={form.color}
                onChange={handleChange("color")}
                required
                className={inputCls}
                placeholder="Enter color"
              />
            </Field>
            <Field label="Material" required>
              <input
                type="text"
                value={form.material}
                onChange={handleChange("material")}
                required
                className={inputCls}
                placeholder="Enter material"
              />
            </Field>
            <Field label="Country" required>
              <input
                type="text"
                value={form.country}
                onChange={handleChange("country")}
                required
                className={inputCls}
                placeholder="Enter country"
              />
            </Field>
            <Field label="Speciality">
              <input
                type="text"
                value={form.speciality}
                onChange={handleChange("speciality")}
                className={inputCls}
                placeholder="Enter Speciality"
              />
            </Field>
            <Field label="Taste / Fragrance">
              <input
                type="text"
                value={form.tasteFragrance}
                onChange={handleChange("tasteFragrance")}
                className={inputCls}
                placeholder="Enter Taste / Fragrance"
              />
            </Field>
          </div>
        </div>

        {/* Product Image & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4 space-y-4">
            <SingleImageUpload
              value={form.productImage}
              onChange={(img) =>
                setForm((prev) => ({ ...prev, productImage: img }))
              }
              label="Product Image"
            />
            <GalleryImageUpload
              value={form.galleryImages}
              onChange={(imgs) =>
                setForm((prev) => ({ ...prev, galleryImages: imgs }))
              }
              label="Gallery Images"
            />
          </div>
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-4">
            <h3 className="text-base font-bold text-slate-900 mb-3">Product Status</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Status</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="productStatus"
                      value="Active"
                      checked={form.productStatus === "Active"}
                      onChange={handleRadio("productStatus", "Active")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="productStatus"
                      value="Inactive"
                      checked={form.productStatus === "Inactive"}
                      onChange={handleRadio("productStatus", "Inactive")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">Inactive</span>
                  </label>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Publish on Store / POS</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishOnStore"
                      value="Yes"
                      checked={form.publishOnStore === "Yes"}
                      onChange={handleRadio("publishOnStore", "Yes")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishOnStore"
                      value="No"
                      checked={form.publishOnStore === "No"}
                      onChange={handleRadio("publishOnStore", "No")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">No</span>
                  </label>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Allow purchase</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="allowPurchase"
                      value="Yes"
                      checked={form.allowPurchase === "Yes"}
                      onChange={handleRadio("allowPurchase", "Yes")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="allowPurchase"
                      value="No"
                      checked={form.allowPurchase === "No"}
                      onChange={handleRadio("allowPurchase", "No")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">No</span>
                  </label>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Allow Sales</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="allowSales"
                      value="Yes"
                      checked={form.allowSales === "Yes"}
                      onChange={handleRadio("allowSales", "Yes")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="allowSales"
                      value="No"
                      checked={form.allowSales === "No"}
                      onChange={handleRadio("allowSales", "No")}
                      className="w-3.5 h-3.5 text-[#1e5fa5] border-slate-300 focus:ring-[#1e5fa5]"
                    />
                    <span className="text-sm font-medium text-slate-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
