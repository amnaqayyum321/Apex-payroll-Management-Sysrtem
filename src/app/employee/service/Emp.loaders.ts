import { EmpFormList } from '../../employee/state/employee.form-list';
import { FormsService } from '../../features/forms/Services/forms';
import { UsersAndRolesService } from '../../features/Users-And-Roles/Services/user-roles';

export abstract class EmpLoaders extends EmpFormList {
  protected abstract get _formSv(): FormsService;
  protected abstract get _usersv(): UsersAndRolesService;

  currentPage = 0;
  pageSize = 100;

  IdTypeList: any;
  belongingList: any;
  LeaveTypeList: any;
  roleList: any;

  loadDepartment() {
    this._formSv.GetDepartment(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.departmentList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadDesignation() {
    this._formSv.getAllDesignations(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.designationList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadCompanyBranch() {
    this._formSv.getAllComapnyBranches(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.companyBranchList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadEmployeeGrade() {
    this._formSv.GetEmployeeGrade(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.EmployeeGradeList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadEmployeeCategory() {
    this._formSv.GetEmployeeCaterogy(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.EmployeeCategoryList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadJobTitle() {
    this._formSv.GetJobTitle(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.JobTitleList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadshift() {
    this._formSv.getAllShifts(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.shiftList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadWorkSchedule() {
    this._formSv.getAllWorkSchedules(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.WorkScheduleList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  loadEmployee() {
    this._formSv.GetEmployees(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.EmployeeList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  GetIdType() {
    this._formSv.GetIDType(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.IdTypeList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  getBelongingType() {
    this._formSv.GetBelongingTypes(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.belongingList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  getLeaveType() {
    this._formSv.GetLeaveType(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.LeaveTypeList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  getRole() {
    this._usersv.getRoles(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) this.roleList = res.data;
      },
      (err: any) => console.log(err),
    );
  }

  // ─── Load All Dropdowns at Once (ngOnInit mein ek call) ───────────────────
  loadAllDropdowns() {
    this.loadDepartment();
    this.loadDesignation();
    this.loadCompanyBranch();
    this.loadEmployeeGrade();
    this.loadEmployeeCategory();
    this.loadJobTitle();
    this.loadshift();
    this.loadEmployee();
    this.loadWorkSchedule();
    this.getRole();
    this.GetIdType();
    this.getBelongingType();
    this.getLeaveType();
  }
}
