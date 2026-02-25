import VendorEntity from "../../entity/VendorEntity";

export default interface IAdminRepo {
  createVendor(payload: VendorEntity): Promise<VendorEntity>;
  getVendorByID(vendorId: number): Promise<VendorEntity | null>;
  getAllVendor(): Promise<VendorEntity[]>;
}
