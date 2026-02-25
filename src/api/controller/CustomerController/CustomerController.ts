import { ControllerPayload } from "../../../constants";
import {
  CreateCustomerDTO,
  CustomerLoginDTO,
  CustomerPayload,
  EditCustomerProfileInputs,
  OrderInputs
} from "../../dto/interface/Customer.dto";
import ICustomerController from "./CustomerController.interface";
import CustomerService from "../../services/CustomerService/CustomerService";
import { AuthPayload } from "../../dto/Auth.dto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth.utility";

export default class CustomerController implements ICustomerController {
  private customerService: CustomerService;
  constructor(customerService: CustomerService) {
    this.customerService = customerService;
  }

  signUp = async (payload: ControllerPayload) => {
    try {
      const input = new CreateCustomerDTO(payload.req.body);
      const { otp } = await this.customerService.signUp(input);

      return payload.res.status(201).json({
        otp,
        message: "Customer created, OTP sent. Please verify OTP to complete registration.",
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Customer signup failed" },
      });
    }
  };

  otpVerify = async (payload: ControllerPayload) => {
    try {
      const { otp, email, phone } = payload.req.body;

      if (!email && !phone) {
        return payload.res.status(400).json({
          error: { message: "Email or phone number is required for OTP verification" },
        });
      }

      if (!otp) {
        return payload.res.status(400).json({
          error: { message: "OTP is required" },
        });
      }

      const result = await this.customerService.verifyOtp(
        parseInt(otp),
        email,
        phone
      );

      if (!result.customer) {
        return payload.res.status(400).json({
          error: { message: "Invalid OTP or Expired" },
        });
      }

      const authPayload: CustomerPayload = {
        _id: result.customer.customerId!.toString(),
        email: email || "", // This should come from person level
        role: "customer" as const,
        verified: true, // result from verifyOtp means it's verified
      };

      const accessToken = generateAccessToken(authPayload);
      const refreshToken = generateRefreshToken(authPayload);

      return payload.res.status(200).json({
        accessToken,
        refreshToken,
        email: authPayload.email,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "OTP verification failed" },
      });
    }
  };

  signIn = async (payload: ControllerPayload) => {
    try {
      const input: CustomerLoginDTO = payload.req.body;

      if (!input.email && !input.phone) {
        return payload.res.status(400).json({
          error: { message: "Email or phone number is required for login" },
        });
      }

      if (!input.password) {
        return payload.res.status(400).json({
          error: { message: "Password is required" },
        });
      }

      const result = await this.customerService.signIn(
        input.password,
        input.email,
        input.phone
      );

      if (!result) {
        return payload.res.status(401).json({
          error: { message: "Invalid credentials" },
        });
      }

      return payload.res.status(200).json({
        accessToken: result.signature,
        signature: result.signature,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Sign-in failed" },
      });
    }
  };

  profileDetails = async (payload: ControllerPayload) => {
    try {
      const customer = payload.req.user;
      if (!customer || !customer._id) {
        return payload.res.status(401).json({
          error: { message: "User not authenticated" },
        });
      }

      const profile = await this.customerService.getCustomerById(parseInt(customer._id));
      return payload.res.status(200).json({ profile });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Operation failed" },
      });
    }
  };

  addDetailsOfUser = async (payload: ControllerPayload) => {
    try {
      const customer = payload.req.user;
      if (!customer || !customer._id) {
        return payload.res.status(401).json({
          error: { message: "User not authenticated" },
        });
      }

      const input = new EditCustomerProfileInputs(payload.req.body);
      const updatedCustomer = await this.customerService.updateProfile(
        parseInt(customer._id),
        input
      );

      return payload.res.status(200).json({
        message: "Profile updated successfully",
        customer: updatedCustomer,
      });
    } catch (error: any) {
      return payload.res.status(500).json({
        error: { message: error.message || "Operation failed" },
      });
    }
  };

  addToWishlist = async (payload: ControllerPayload) => {
    const customer = payload.req.user;
    if (!customer) {
      return payload.res.status(401).json({ error: { message: "Unauthorized" } });
    }
    const { foodDocId, unit } = payload.req.body;
    try {
      const updatedCart = await this.customerService.addToCart(
        parseInt(customer._id),
        parseInt(foodDocId),
        unit
      );
      return payload.res.status(200).json({ cart: updatedCart });
    } catch (error: any) {
      return payload.res.status(500).json({ error: { message: error.message || "Operation failed" } });
    }
  };

  allWishlistFood = async (payload: ControllerPayload) => {
    const customer = payload.req.user;
    if (!customer) return payload.res.status(401).json({ error: { message: "Unauthorized" } });
    try {
      const cart = await this.customerService.getCart(parseInt(customer._id));
      return payload.res.status(200).json({ cart });
    } catch (error: any) {
      return payload.res.status(500).json({ error: { message: error.message || "Failed" } });
    }
  };
}
