import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offers-approval',
  imports: [CommonModule,FormsModule],
  templateUrl: './offers-approval.html',
  styleUrl: './offers-approval.scss',
})
export class OffersApproval {
 offerList: any[] = [];
  selectedOffer: any;
  selectedStatus = '';
  allowedStatuses: string[] = [];
  showModal = false;
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

OFFER_STATUS_FLOW: any = {
  DRAFT: ['PENDING_APPROVAL'],
  PENDING_APPROVAL: ['APPROVED', 'DECLINED'],
  APPROVED: ['SENT'],
  SENT: ['ACCEPTED', 'DECLINED', 'EXPIRED', 'WITHDRAWN'],
  ACCEPTED: [],
  DECLINED: [],
  EXPIRED: [],
  WITHDRAWN: []
};
  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService
  ) {}

  ngOnInit() {
   this.loadOffers();
  }

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOffers();
  }

   loadOffers() {
    this.loader.show();
    const backendPage = this.currentPage - 1;

    this.onboardingService
      .getAllOffer(backendPage, this.itemsPerPage)
      .subscribe({
        next: (res: any) => {
          this.loader.hide();
          this.offerList = res.data;
          this.totalItems = res.paginator.totalItems;
          this.totalPagesCount = res.paginator.totalPages;
          this.currentPage = res.paginator.currentPage + 1;
        },
        error: () => {
          this.loader.hide();
          this.toastr.error('Failed to load offers');
        }
      });
  }

  openApprovalModal(offer: any) {
    this.selectedOffer = offer;
    this.allowedStatuses = this.OFFER_STATUS_FLOW[offer.status] || [];
    this.selectedStatus = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

   updateStatus() {

    if (!this.selectedStatus) {
      this.toastr.warning('Please select status');
      return;
    }

    if (!this.allowedStatuses.includes(this.selectedStatus)) {
      this.toastr.error('Invalid status transition!');
      return;
    }

    this.loader.show();

    this.onboardingService
      .updateOfferStatus(this.selectedOffer.publicId, this.selectedStatus)
      .subscribe({
        next: () => {
          this.loader.hide();
          this.toastr.success('Offer status updated');
          this.showModal = false;
          this.loadOffers();
        },
        error: () => {
          this.loader.hide();
          this.toastr.error('Status update failed');
        }
      });
  }

  getBreadcrumbs(status: string) {

    const mainFlow = [
      'DRAFT',
      'PENDING_APPROVAL',
      'APPROVED',
      'SENT',
      'ACCEPTED'
    ];

    const index = mainFlow.indexOf(status);

    if (index !== -1) {
      return mainFlow.slice(0, index + 1);
    }

    if (status === 'DECLINED') return ['SENT', 'DECLINED'];
    if (status === 'EXPIRED') return ['SENT', 'EXPIRED'];
    if (status === 'WITHDRAWN') return ['SENT', 'WITHDRAWN'];

    return [];
  }

}
