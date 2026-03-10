export const PERMISSION_MENU_MAP: Record<string, string[]> = {
  // Setups
  ADMIN_USERS_VIEW: ['Setups', 'User Setups', 'Users'],
  ADMIN_ROLES_VIEW: ['Setups', 'User Setups', 'Roles'],

  // Master Data - General
  ADMIN_DEPARTMENTS_VIEW: ['Master Data', 'General-Master-Data', 'Department'],
  ADMIN_DESIGNATIONS_VIEW: ['Master Data', 'General-Master-Data', 'Designation'],
  ADMIN_COMPANY_BRANCHES_VIEW: ['Master Data', 'General-Master-Data', 'Company'],
  ADMIN_PAY_PERIODS_VIEW: ['Master Data', 'General-Master-Data', 'Pay Period'],
  ADMIN_WORK_SCHEDULES_VIEW: ['Master Data', 'General-Master-Data', 'Work Schedule'],
  ADMIN_PROJECTS_VIEW: ['Master Data', 'General-Master-Data', 'Projects'],
  ADMIN_JOB_TITLES_VIEW: ['Master Data', 'General-Master-Data', 'Job Tite'],
  ADMIN_PAY_ELEMENTS_VIEW: ['Master Data', 'General-Master-Data', 'Pay Element'],
  ADMIN_ID_TYPES_VIEW: ['Master Data', 'General-Master-Data', 'ID Type'],

  // Master Data - Attendance
  PAYROLL_LEAVE_APPLICATIONS_VIEW: ['Master Data', 'Attendence-Master-Data', 'Leaves'],
  ADMIN_LEAVE_TYPES_VIEW: ['Master Data', 'Attendence-Master-Data', 'Leave Type'],
  ADMIN_SHIFTS_VIEW: ['Master Data', 'Attendence-Master-Data', 'Shifts'],

  // Master Data - Employees
  ADMIN_EMPLOYEE_CATEGORIES_VIEW: ['Master Data', ' Employees-Master-Data', 'Employees Category'],
  ADMIN_EMPLOYEE_GRADES_VIEW: ['Master Data', ' Employees-Master-Data', 'Employees Grade'],
  ADMIN_BELONGING_TYPES_VIEW: ['Master Data', ' Employees-Master-Data', 'Belonging Types'],

  // Onboarding - Recruitment
  RECRUIT_JOB_REQUISITIONS_VIEW: ['Onboarding', 'Recruitment', 'Requistion'],
  RECRUIT_CANDIDATES_VIEW: ['Onboarding', 'Recruitment', 'Candidates'],
  RECRUIT_APPLICATIONS_VIEW: ['Onboarding', 'Recruitment', 'Candidate Application'],
  RECRUIT_INTERVIEWS_VIEW: ['Onboarding', 'Recruitment', 'Interview'],
  RECRUIT_PANELS_VIEW: ['Onboarding', 'Recruitment', 'Interview Panel'],
  RECRUIT_INTERVIEWS_MANAGE: ['Onboarding', 'Recruitment', 'Interview Feedback'],
  RECRUIT_OFFERS_VIEW: ['Onboarding', 'Recruitment', 'Final Screening'],

  // Onboarding - Approvals
  RECRUIT_JOB_REQUISITIONS_MANAGE: ['Onboarding', 'Approvals', 'Requistion Approval'],
  RECRUIT_CANDIDATES_MANAGE: ['Onboarding', 'Approvals', 'Candidate Approval'],
  RECRUIT_APPLICATIONS_MANAGE: ['Onboarding', 'Approvals', 'Interview Approval'],
  RECRUIT_OFFERS_MANAGE: ['Onboarding', 'Approvals', 'Offers Approval'],

  // Payroll
  PAYROLL_RUNS_VIEW: ['PayRoll'],
  PAYROLL_RUNS_MANAGE: ['PayRoll'],
};
