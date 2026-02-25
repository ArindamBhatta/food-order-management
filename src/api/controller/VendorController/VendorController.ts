import { ControllerPayload } from "../../../constants";
import { AuthPayload } from "../../dto/Auth.dto";
import {
  EditVendorProfileDTO,
  LoginVendorDTO,
  VendorResponseDTO,
} from "../../dto/interface/Vendor.dto";
import { CreateFoodInput, FoodResponse } from "../../dto/interface/Food.dto";
import FoodService from "../../services/FoodService/FoodService";
import VendorService from "../../services/VendorService/VendorService";
import { LoginResponse } from "../../services/VendorService/VendorService.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/auth.utility";
import IVendorController from "./VendorController.interface";

export default class VendorController implements IVendorController {
  private vendorService: VendorService;
  private foodService: FoodService;
  constructor(vendorService: VendorService, foodService: FoodService) {
    this.vendorService = vendorService;
    this.foodService = foodService;
  }

  vendorLogin = async (payload: ControllerPayload) => {
    try {
      const loginVendor = new LoginVendorDTO();
      Object.assign(loginVendor, payload.req.body);

      const loginResponse: LoginResponse = await this.vendorService.vendorLogin(loginVendor);

      const vendorResponse = new VendorResponseDTO(loginResponse.vendor);
      return payload.res.status(200).json({
        success: true,
        message: "Login successful",
        vendor: vendorResponse,
        accessToken: loginResponse.accessToken,
      });
    } catch (error: any) {
      console.error("Error in vendorLogin:", error);
      return payload.res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  };

  refreshTokenRegenerate = async (payload: ControllerPayload) => {
    try {
      const oldRefreshToken = payload.req.cookies?.refreshToken || payload.req.body.refreshToken;
      if (!oldRefreshToken) {
        return payload.res.status(401).json({ success: false, message: "No refresh token provided" });
      }

      const payloadData = verifyRefreshToken(oldRefreshToken);
      if (!payloadData || !payloadData._id) {
        return payload.res.status(401).json({ success: false, message: "Invalid refresh token" });
      }

      const vendor = await this.vendorService.vendorProfile(parseInt(payloadData._id));
      if (!vendor) {
        return payload.res.status(404).json({ success: false, message: "Vendor not found" });
      }

      const newRefreshToken = generateRefreshToken(payloadData);
      const newAccessToken = generateAccessToken(payloadData);

      return payload.res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error: any) {
      return payload.res.status(500).json({ success: false, message: error.message });
    }
  };

  vendorProfile = async (payload: ControllerPayload) => {
    try {
      const user = payload.req.user;
      if (!user) return payload.res.status(401).json({ success: false, message: "Unauthorized" });

      const vendor = await this.vendorService.vendorProfile(parseInt(user._id));
      if (!vendor) return payload.res.status(404).json({ success: false, message: "Vendor not found" });

      const response = new VendorResponseDTO(vendor);
      return payload.res.status(200).json({
        success: true,
        vendor: {
          ...response,
          // Re-adding person details because they're on vendor object now
          ownerName: vendor.ownerName,
          ownerEmail: vendor.ownerEmail,
          ownerPhone: vendor.ownerPhone
        }
      });
    } catch (error: any) {
      return payload.res.status(500).json({ success: false, message: error.message });
    }
  };

  updateVendorProfile = async (payload: ControllerPayload) => {
    try {
      const user = payload.req.user;
      if (!user) return payload.res.status(401).json({ success: false, message: "Unauthorized" });

      const updateData = new EditVendorProfileDTO();
      Object.assign(updateData, payload.req.body);

      const updatedVendor = await this.vendorService.updateVendorProfile(parseInt(user._id), updateData);
      return payload.res.status(200).json({ success: true, vendor: updatedVendor });
    } catch (error: any) {
      return payload.res.status(500).json({ success: false, message: error.message });
    }
  };

  updateShopImage = async (payload: ControllerPayload) => {
    try {
      const user = payload.req.user;
      if (!user) return payload.res.status(401).json({ success: false, message: "Unauthorized" });

      const updatedVendor = await this.vendorService.updateShopImage(parseInt(user._id), payload.req.file);
      return payload.res.status(200).json({ success: true, vendor: updatedVendor });
    } catch (error: any) {
      return payload.res.status(500).json({ success: false, message: error.message });
    }
  };

  vendorAddFoods = async (payload: ControllerPayload) => {
    try {
      const user = payload.req.user;
      if (!user) return payload.res.status(401).json({ success: false, message: "Unauthorized" });

      const input = new CreateFoodInput(payload.req.body);
      const createdFood = await this.foodService.addFood(parseInt(user._id), input, payload.req.files as any[]);

      return payload.res.status(201).json({
        success: true,
        food: createdFood,
        message: "Food added successfully",
      });
    } catch (error: any) {
      return payload.res.status(500).json({ success: false, message: error.message });
    }
  };

  fetchAllFood = async (payload: ControllerPayload) => {
    try {
      const user = payload.req.user;
      if (!user) return payload.res.status(401).json({ success: false, message: "Unauthorized" });

      const foods = await this.foodService.getFoods(parseInt(user._id));
      return payload.res.status(200).json({ success: true, foods });
    } catch (error: any) {
      return payload.res.status(500).json({ success: false, message: error.message });
    }
  };

  getCurrentOrder = async (payload: ControllerPayload) => { throw new Error("Not implemented"); };
  getOrderDetails = async (payload: ControllerPayload) => { throw new Error("Not implemented"); };
  processOrder = (payload: ControllerPayload) => { throw new Error("Not implemented"); };
}
