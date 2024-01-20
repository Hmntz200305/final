from app.module.test import test
from app.module.auth import Login, Authentication, AdminList
from app.module.listasset import ListAsset, DeleteAsset, StatusList, LocationList, CategoryList, EditAsset, ListAssetExcept
from app.module.addasset import AddStatus, AddLocation, AddCategory, AddAsset
from app.module.manageuser import Register, ManageUser, DeleteUser, EditUser, VerifyEmail
from app.module.lease import LeaseTicket, LeaseSubmited, TicketApprove, TicketDecline
from app.module.dashboard import DashboardInfo
from app.module.returns import inLoanAssetList, ReturnAsset
from app.module.history import HistoryTicket, HistoryLoanData
from app.module.myreport import MyReport, MyReportDelete
from app.module.forgotpassword import ForgotPassword, VerifyEmailForgotPw
from app.module.imports import UploadCsv
from app.module.qrcode import QrGenerator, QrScanner, LeaseTicketScanner, QrScannerCheck
