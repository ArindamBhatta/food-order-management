import { VendorDAO } from "../../../infrastructure/daos/VendorDAO";
import { PersonDAO } from "../../../infrastructure/daos/PersonDAO";
import VendorEntity from "../../entity/VendorEntity";
import IVendorRepo from "./VendorRepo.interface";

export default class VendorRepo implements IVendorRepo {
  private vendorDao: VendorDAO;
  private personDao: PersonDAO;

  constructor(vendorDao: VendorDAO, personDao: PersonDAO) {
    this.vendorDao = vendorDao;
    this.personDao = personDao;
  }

  findVendor = async ({
    vendorId,
    email,
  }: {
    vendorId?: number;
    email?: string;
  }): Promise<VendorEntity | null> => {
    try {
      let vendorRow = null;
      let personRow = null;

      // Find the person via email
      if (email) {
        personRow = await this.personDao.getByEmail(email);
        if (personRow) {
          // I need a getByPersonId for find the vendor
          vendorRow = await this.vendorDao.getByPersonId(personRow.personId);
        }
      } else if (vendorId) {
        vendorRow = await this.vendorDao.getById(vendorId);
        if (vendorRow && vendorRow.personId) {
          personRow = await this.personDao.getById(vendorRow.personId);
        }
      }

      if (!vendorRow || !personRow) return null;

      return new VendorEntity({
        ...vendorRow,
        ownerName: personRow.fullName,
        ownerEmail: personRow.email,
        ownerPhone: personRow.phoneNumber,
        password: personRow.password,
        salt: personRow.salt,
        accessToken: personRow.accessToken,
        refreshToken: personRow.refreshToken,
      });
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
      const vendorRow = await this.vendorDao.getById(vendorId);
      if (vendorRow && vendorRow.personId) {
        await this.personDao.update(vendorRow.personId, { refreshToken });
      }
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
      const vendorRow = await this.vendorDao.getById(vendorId);
      if (!vendorRow || !vendorRow.personId) return null;

      // Update person info if applicable
      if (updateData.ownerName || updateData.ownerEmail || updateData.ownerPhone) {
        await this.personDao.update(vendorRow.personId, {
          fullName: updateData.ownerName,
          email: updateData.ownerEmail,
          phoneNumber: updateData.ownerPhone
        });
      }

      // Update vendor info
      const updatedVendorRow = await this.vendorDao.update(vendorId, updateData);
      const personRow = await this.personDao.getById(vendorRow.personId);

      return new VendorEntity({
        ...updatedVendorRow,
        ownerName: personRow.fullName,
        ownerEmail: personRow.email,
        ownerPhone: personRow.phoneNumber
      });
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
      const row = await this.vendorDao.getById(vendorId);
      if (!row) throw new Error("Vendor not found");

      let coverImages = row.coverImages ? JSON.parse(row.coverImages) : [];
      coverImages.push(imageUrl);

      const updatedRow = await this.vendorDao.update(vendorId, { coverImages: JSON.stringify(coverImages) });

      const personRow = row.personId ? await this.personDao.getById(row.personId) : null;

      return new VendorEntity({
        ...updatedRow,
        ownerName: personRow?.fullName,
        ownerEmail: personRow?.email,
        ownerPhone: personRow?.phoneNumber
      });
    } catch (error) {
      console.error("Error in VendorRepo.updateShopImage:", error);
      throw error;
    }
  };
}
