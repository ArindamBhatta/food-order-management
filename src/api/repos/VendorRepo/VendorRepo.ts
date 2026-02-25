import { VendorDAO } from "../../../infrastructure/daos/VendorDAO";
import VendorEntity from "../../entity/VendorEntity";
import IVendorRepo from "./VendorRepo.interface";

export default class VendorRepo implements IVendorRepo {
  private dao: VendorDAO;

  constructor(dao: VendorDAO) {
    this.dao = dao;
  }

  findVendor = async ({
    vendorId,
    email,
  }: {
    vendorId?: number;
    email?: string;
  }): Promise<VendorEntity | null> => {
    try {
      if (email) {
        // Since VendorDAO doesn't have getByEmail yet, 
        // I should probably add it or use a query.
        // Let's add getByEmail to VendorDAO as well.
        throw new Error("getByEmail not implemented in VendorDAO");
      } else if (vendorId) {
        const row = await this.dao.getById(vendorId);
        return row ? VendorEntity.fromRow(row) : null;
      }
      return null;
    } catch (error) {
      console.error("Error in VendorRepo.findVendor:", error);
      throw error;
    }
  };

  updateRefreshToken = async (
    vendorId: number,
    refreshToken: string
  ): Promise<void> => {
    try {
      await this.dao.update(vendorId, { refreshToken });
    } catch (error) {
      console.error("Error in VendorRepo.updateRefreshToken:", error);
      throw error;
    }
  };

  updateOwnerProfile = async (
    vendorId: number,
    updateData: any
  ): Promise<VendorEntity | null> => {
    try {
      const row = await this.dao.update(vendorId, updateData);
      return row ? VendorEntity.fromRow(row) : null;
    } catch (error) {
      console.error("Error in VendorRepo.updateOwnerProfile:", error);
      throw error;
    }
  };

  updateShopImage = async (
    vendorId: number,
    imageUrl: string
  ): Promise<VendorEntity | null> => {
    try {
      // In Drizzle/SQLite, we handle coverImages differently if it's a JSON string
      // For now, I'll assume we update the specific field.
      // Note: vendor.coverImages in schema is text (likely JSON).
      const row = await this.dao.getById(vendorId);
      if (!row) throw new Error("Vendor not found");

      let coverImages = row.coverImages ? JSON.parse(row.coverImages) : [];
      coverImages.push(imageUrl);

      const updatedRow = await this.dao.update(vendorId, { coverImages: JSON.stringify(coverImages) });
      return updatedRow ? VendorEntity.fromRow(updatedRow) : null;
    } catch (error) {
      console.error("Error in VendorRepo.updateShopImage:", error);
      throw error;
    }
  };
}
