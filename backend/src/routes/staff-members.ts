import express from "express";
import StaffMemberController from "../controllers/staffMemberController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", validateJwt, StaffMemberController.getStaffMemberById);

router.get("/", validateJwt, StaffMemberController.getAllStaffMembers);

router.post("/", validateJwt, StaffMemberController.addStaffMember);

router.patch("/:id", validateJwt, StaffMemberController.updateStaffMember);

router.delete("/:id", validateJwt, StaffMemberController.deleteStaffMember);

export default router;
