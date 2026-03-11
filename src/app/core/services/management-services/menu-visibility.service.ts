import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PERMISSION_MENU_MAP } from '../../constants/permission-menu.map';

export interface MenuVisibilityConfig {
  [key: string]: boolean;
}
const ALL_MENU_LABELS = [
  'Dashboard',
  'Setups',
  'User Setups',
  'Users',
  'Roles',
  'Configuration',
  'Master Data',
  'General-Master-Data',
  'Department',
  'Designation',
  'Company',
  'Pay Period',
  'Work Schedule',
  'Projects',
  'Job Tite',
  'Pay Element',
  'ID Type',
  'Attendence-Master-Data',
  'Leaves',
  'Leave Type',
  'Shifts',
  ' Employees-Master-Data',
  'Employees Category',
  'Employees Grade',
  'Belonging Types',
  'Onboarding',
  'Recruitment',
  'Requistion',
  'Candidates',
  'Candidate Application',
  'Interview',
  'Interview Panel',
  'Interview Feedback',
  'Final Screening',
  'Approvals',
  'Requistion Approval',
  'Candidate Approval',
  'Interview Approval',
  'Offers Approval',
  'PayRoll',
  'Time Sheet',
  'Reports',
];
@Injectable({
  providedIn: 'root',
})
export class MenuVisibilityService {
  // private menuVisibilitySubject = new BehaviorSubject<MenuVisibilityConfig>({});
  // public menuVisibility$ = this.menuVisibilitySubject.asObservable();

  // /**
  //  * Update visibility of menu items based on user permissions or other criteria
  //  * @param config Object with menu labels as keys and visibility as boolean values
  //  *
  //  * Example:
  //  * menuVisibilityService.updateMenuVisibility({
  //  *   'Offers': true,
  //  *   'Chat': true,
  //  *   'Admin': false
  //  * });
  //  */
  // updateMenuVisibility(config: MenuVisibilityConfig) {
  //   this.menuVisibilitySubject.next(config);
  // }

  // /**
  //  * Update a single menu item visibility
  //  * @param menuLabel Label of the menu item
  //  * @param isVisible Visibility flag
  //  */
  // setMenuItemVisibility(menuLabel: string, isVisible: boolean) {
  //   const current = this.menuVisibilitySubject.value;
  //   this.menuVisibilitySubject.next({
  //     ...current,
  //     [menuLabel]: isVisible,
  //   });
  // }

  // /**
  //  * Get current visibility configuration
  //  */
  // getCurrentVisibility(): MenuVisibilityConfig {
  //   return this.menuVisibilitySubject.value;
  // }
  // menu-visibility.service.ts
  //
  private visibilitySubject = new BehaviorSubject<Record<string, boolean> | null>(null);

  menuVisibility$ = this.visibilitySubject.asObservable();

  applyPermissions(permissionCodes: string[]) {
    const permSet = new Set(permissionCodes);
    const visibility: Record<string, boolean> = {};

    ALL_MENU_LABELS.forEach((label) => (visibility[label] = false)); // ✅ sab false
    visibility['Dashboard'] = true;

    for (const [permission, labels] of Object.entries(PERMISSION_MENU_MAP)) {
      if (permSet.has(permission)) {
        labels.forEach((label) => (visibility[label] = true));
      }
    }
    console.log('🟢 applyPermissions called, count:', permissionCodes.length);
    console.log('🟢 visibility subject next called');
    this.visibilitySubject.next(visibility);
  }
  resetMenu() {
    this.visibilitySubject.next(null);
  }
}
