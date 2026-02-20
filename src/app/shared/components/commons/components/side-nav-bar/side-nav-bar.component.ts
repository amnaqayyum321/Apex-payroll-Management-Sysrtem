import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../../../../core/services/management-services/Theme.service';
import { ToggleService } from '../../../../../core/services/management-services/ToggleService';
import { SessionService } from '../../../../../core/services/management-services/Session.service';
import { MenuVisibilityService } from '../../../../../core/services/management-services/menu-visibility.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem, MenuGroup } from '../../../../interfaces/menu-item.interface';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbCollapseModule],
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent implements OnInit {
  isOpen = true;
  isDarkMode = false;

  // Dynamic menu structure
  topLevelItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/panel/dashboard', isVisible: true },
  ];

  menuGroups: MenuGroup[] = [
    {
      label: 'Setups',
      icon: 'fa-solid fa-gear',
      isVisible: true,
      collapsed: true,
      children: [
        {
          label: 'User Setups',
          icon: 'fa-solid fa-user-circle',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Users',
              route: 'users-and-roles/view-users',
              icon: 'fa-solid fa-people-group',
              isVisible: true,
            },

            {
              label: 'Roles',
              route: 'users-and-roles/view-roles',
              icon: 'fa-solid fa-user-shield',
              isVisible: true,
            },
          ],
        },
        {
          label: 'Configuration',
          icon: 'fa-solid fa-sitemap',
          isVisible: false,
          collapsed: true,
          children: [
            {
              label: 'Employees',
              route: 'employees-master-data/view-all-employees',

              isVisible: true,
            },
            {
              label: 'Onboarding Employees',
              route: 'employees-master-data/onboarding-employees',

              isVisible: true,
            },

            { label: 'GOSIID', route: 'employees-master-data/view-all-gosii', isVisible: false },
            {
              label: 'Departments',
              route: 'employees-master-data/view-all-departments',
              isVisible: false,
            },
            {
              label: 'Medical Insurance',
              route: 'employees-master-data/view-all-medical-insurance',
              isVisible: false,
            },
            {
              label: 'Accommodation',
              route: 'employees-master-data/view-all-accommodation',
              isVisible: false,
            },
            { label: 'Loans', route: 'employees-master-data/view-all-loans', isVisible: false },
            {
              label: 'Employee Belongings',
              route: 'employees-master-data/view-all-employee-belongings',
              isVisible: false,
            },
            {
              label: 'Employees Category',
              route: 'employees-master-data/view-all-employees-category',
              isVisible: false,
            },
            {
              label: 'Project Transfer',
              route: 'employees-master-data/view-all-project-transfer',
              isVisible: false,
            },
          ],
        },
       
      ],
    },
    {
      label: 'Master Data',
      icon: 'fa-solid fa-database',
      isVisible: true,
      collapsed: true,
      children: [
        {
          label: 'General-Master-Data',
          icon: 'fa-solid fa-layer-group',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Department',
              route: 'forms/department',
              icon: 'fa-solid fa-building',
              isVisible: true,
            },
            {
              label: 'Designation',
              route: 'forms/view-designations',
              icon: 'fa-solid fa-id-badge',
              isVisible: true,
            },

            {
              label: 'Company',
              route: 'forms/company',
              icon: 'fa-solid fa-city',
              isVisible: true,
            },
            {
              label: 'Pay Period',
              route: 'forms/pay-period',
              isVisible: true,
              icon: 'fa-solid fa-calendar-days',
            },
            {
              label: 'Work Schedule',
              route: 'forms/work-schedule',
              isVisible: true,
              icon: 'fa-solid fa-clock',
            },
            {
              label: 'Projects',
              route: 'forms/projects',
              isVisible: true,
              icon: 'fa-solid fa-project-diagram',
            },
         
            {
              label: 'Loan Types',
              route: 'forms/loan-types',
              isVisible: true,
              icon: 'fa-solid fa-money-bill-wave',
            }
          
          ],
        },
        {
          label: 'Attendence-Master-Data',
          icon: 'fa-solid fa-clipboard-user',
          isVisible: true,
          collapsed: true,
          children: [
               {
              label: 'Leaves',
              route: 'forms/leaves',
              isVisible: true,
              icon: 'fa-solid fa-calendar-check',
            },
            {
              label: 'Leave Application',
              route: 'forms/leave-application',
              icon: 'fa-solid fa-file-signature',
              isVisible: true,
            },
            {
              label: 'Leaves Master Data',
              route: 'forms/leaves-master-data',
              icon: 'fa-solid fa-file-alt',
              isVisible: true,
            },

            {
              label: 'Shifts',
              route: 'forms/shifts',
              icon: 'fa-solid fa-clock',
              isVisible: true,
            }
          ],
        },
         {
          label: ' Employees-Master-Data',
          icon: 'fa-solid fa-users',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Employees',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-user-tie',
              isVisible: true,
            }
            
          ],
        },
     
      ],
    },
  
    {
      label: 'Recruitment',
      icon: 'fa-solid fa-user-tie',
      isVisible: false,
      collapsed: true,
      children: [
        {
          label: 'Recruitment',
          icon: 'fa-solid fa-briefcase',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Requisition',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-user-tie',
              isVisible: true,
            },
            {
              label: 'Candidate Information',
              route: 'employees-master-data/onboarding-employees',
              icon: 'fa-solid fa-id-card',
              isVisible: true,
            },

            {
              label: 'Screening',
              route: 'employees-master-data/view-all-gosiid',
              icon: 'fa-solid fa-filter',
              isVisible: true,
            },
            {
              label: 'Interview Scheduling',
              route: 'employees-master-data/view-all-departments',
              icon: 'fa-solid fa-calendar-check',
              isVisible: true,
            },
            {
              label: 'Interviews Result',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-clipboard-check',
              isVisible: false,
            },
          ],
        },
        {
          label: 'Selection',
          icon: 'fa-solid fa-user-check',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Offer Letter',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-file-signature',
              isVisible: true,
            },
            {
              label: 'Contact',
              route: 'employees-master-data/onboarding-employees',
              icon: 'fa-solid fa-address-book',
              isVisible: true,
            },

            {
              label: 'Mobilization',
              route: 'employees-master-data/view-all-gosiid',
              icon: 'fa-solid fa-people-carry-box',
              isVisible: true,
            },
            {
              label: 'Joining',
              route: 'employees-master-data/view-all-departments',
              icon: 'fa-solid fa-user-plus',
              isVisible: true,
            },
            {
              label: 'Interview Report',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-clipboard-list',
              isVisible: false,
            },
            {
              label: 'Selection',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-check-double',
              isVisible: false,
            },
          ],
        },
      ],
    },
    // Payroll Process Start
    {
      label: 'PayRoll',
      icon: 'fa-solid fa-money-check-dollar',
      isVisible: false,
      collapsed: true,
      children: [
        {
          label: 'Application',
          icon: 'fa-solid fa-file-circle-plus',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Daily Sheet Time',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-calendar-days',
              isVisible: true,
            },

            {
              label: 'Pending Application',
              route: 'employees-master-data/view-all-gosiid',
              icon: 'fa-solid fa-hourglass-half',
              isVisible: true,
            },
            {
              label: 'Department Change',
              route: 'employees-master-data/view-all-departments',
              icon: 'fa-solid fa-people-arrows',
              isVisible: true,
            },
            {
              label: 'Increment Arrears',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
          ],
        },
        {
          label: 'PayRoll',
          icon: 'fa-solid fa-user-check',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Pay Period',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-calendar-alt',
              isVisible: true,
            },
            {
              label: 'PayRoll Process',
              route: 'employees-master-data/onboarding-employees',
              icon: 'fa-solid fa-gears',
              isVisible: true,
            },

            {
              label: 'Resignation/Termination',
              route: 'employees-master-data/view-all-gosiid',
              icon: 'fa-solid fa-user-slash',
              isVisible: true,
            },
            {
              label: 'Full & Final Settlement',
              route: 'employees-master-data/view-all-departments',
              icon: 'fa-solid fa-scale-balanced',
              isVisible: true,
            },
            {
              label: 'Increament/Arrear',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Salery Disbursment',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-money-bill-transfer',
              isVisible: true,
            },
            {
              label: 'Leave Salery',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-calendar-minus',
              isVisible: true,
            },
          ],
        },
      ],
    },
    // Time Sheet Start
    {
      label: 'Time Sheet',
      icon: 'fa-solid fa-clock',
      isVisible: false,
      collapsed: true,
      children: [
        {
          label: 'Attendence',
          icon: 'fa-solid fa-user-clock',
          isVisible: false,
          collapsed: true,
          children: [
            {
              label: 'Daily Attence',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-calendar-day',
              isVisible: true,
            },
          ],
        },
      ],
    },
    // Report Process Start
    {
      label: 'Reports',
      icon: 'fa-solid fa-chart-pie',
      isVisible: false,
      collapsed: true,
      children: [
        {
          label: 'Hr Reports',
          icon: 'fa-solid fa-folder-open',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Employee Profile',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-id-badge',
              isVisible: true,
            },

            {
              label: 'Document Expiry',
              route: 'employees-master-data/view-all-gosiid',
              icon: 'fa-solid fa-file-circle-xmark',
              isVisible: true,
            },
            {
              label: 'Employees',
              route: 'employees-master-data/view-all-departments',
              icon: 'fa-solid fa-users',
              isVisible: true,
            },
            {
              label: 'Current Worker List',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-user-check',
              isVisible: true,
            },
            {
              label: 'Staff List',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Attendance Reports',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Attendance By Category ',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: ' leave Report',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Probation Report',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Appraisal',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Employees Family Details',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Overtime Report',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Employee Agreement',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
          ],
        },
        {
          label: 'Reports',
          icon: 'fa-solid fa-user-check',
          isVisible: true,
          collapsed: true,
          children: [
            {
              label: 'Pay Period',
              route: 'employees-master-data/view-all-employees',
              icon: 'fa-solid fa-calendar-alt',
              isVisible: true,
            },
            {
              label: 'PayRoll Process',
              route: 'employees-master-data/onboarding-employees',
              icon: 'fa-solid fa-gears',
              isVisible: true,
            },

            {
              label: 'Resignation/Termination',
              route: 'employees-master-data/view-all-gosiid',
              icon: 'fa-solid fa-user-slash',
              isVisible: true,
            },
            {
              label: 'Full & Final Settlement',
              route: 'employees-master-data/view-all-departments',
              icon: 'fa-solid fa-scale-balanced',
              isVisible: true,
            },
            {
              label: 'Increament/Arrear',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-chart-line',
              isVisible: true,
            },
            {
              label: 'Salery Disbursment',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-money-bill-transfer',
              isVisible: true,
            },
            {
              label: 'Leave Salery',
              route: 'employees-master-data/view-all-medical-insurance',
              icon: 'fa-solid fa-calendar-minus',
              isVisible: true,
            },
          ],
        },
      ],
    },
  ];

  constructor(
    private toggleService: ToggleService,
    private router: Router,
    private toastr: ToastrService,
    private SessionService: SessionService,
    private themeService: ThemeService,
    private menuVisibilityService: MenuVisibilityService,
  ) {}

  ngOnInit() {
    this.themeService.isLightTheme$.subscribe((value) => {
      this.isDarkMode = !value;
    });

    this.toggleService.sidebarOpen$.subscribe((open) => {
      this.isOpen = open;

      // Collapse all menus when sidebar closes
      if (!open) {
        this.collapseAllMenus();
      }
    });

    // Subscribe to menu visibility changes
    this.menuVisibilityService.menuVisibility$.subscribe((config) => {
      Object.keys(config).forEach((label) => {
        this.updateMenuVisibility(label, config[label]);
      });
    });
  }

  private collapseAllMenus() {
    this.menuGroups.forEach((group) => {
      group.collapsed = true;
      if (group.children) {
        this.collapseChildren(group.children);
      }
    });
  }

  private collapseChildren(items: MenuItem[]) {
    items.forEach((item) => {
      if (item.collapsed !== undefined) {
        item.collapsed = true;
      }
      if (item.children) {
        this.collapseChildren(item.children);
      }
    });
  }

  toggleGroup(group: MenuGroup) {
    if (!this.canToggle()) return;
    group.collapsed = !group.collapsed;
  }

  toggleMenuItem(item: MenuItem) {
    if (item.collapsed !== undefined) {
      item.collapsed = !item.collapsed;
    }
  }

  // Method to update menu item visibility dynamically
  updateMenuVisibility(label: string, isVisible: boolean) {
    // Update top-level items
    const topItem = this.topLevelItems.find((item) => item.label === label);
    if (topItem) {
      topItem.isVisible = isVisible;
      return;
    }

    // Update menu groups
    this.menuGroups.forEach((group) => {
      if (group.label === label) {
        group.isVisible = isVisible;
        return;
      }

      // Check children
      if (group.children) {
        this.updateChildVisibility(group.children, label, isVisible);
      }
    });
  }

  private updateChildVisibility(items: MenuItem[], label: string, isVisible: boolean) {
    items.forEach((item) => {
      if (item.label === label) {
        item.isVisible = isVisible;
        return;
      }
      if (item.children) {
        this.updateChildVisibility(item.children, label, isVisible);
      }
    });
  }

  private canToggle(): boolean {
    return this.isOpen;
  }
}
