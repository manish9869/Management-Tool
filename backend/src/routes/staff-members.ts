import express from "express";
import StaffMemberController from "../controllers/staffMemberController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", StaffMemberController.getStaffMemberById);

router.get("/", StaffMemberController.getAllStaffMembers);

router.post("/", StaffMemberController.addStaffMember);

router.patch("/:id", StaffMemberController.updateStaffMember);

router.delete("/:id", StaffMemberController.deleteStaffMember);

export default router;
