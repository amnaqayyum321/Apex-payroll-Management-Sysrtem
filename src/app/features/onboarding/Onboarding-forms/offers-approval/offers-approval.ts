import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offers-approval',
  imports: [CommonModule, FormsModule],
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
  searchTerm: string = '';
  statusFilter: string = '';
   filteredOffersList: any[] = [];
  paginatedOffersList: any[] = [];

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
  ) { }

  ngOnInit() {
    this.loadOffers();
  }

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get firstItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get isAnyFilterActive(): boolean {
    return !!this.searchTerm || !!this.statusFilter;
  }


  loadOffers() {
    this.loader.show();
 const backendPage = this.currentPage - 1;
  const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
  const page = this.isAnyFilterActive ? 0 : backendPage;
    this.onboardingService
      .getAllOffer(page, pageSize)
      .subscribe({
        next: (res: any) => {
          this.loader.hide();
          this.offerList = res.data.sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() -
          new Date(a.createdDate).getTime()
      );
          this.totalItems = res.paginator.totalItems;
          this.totalPagesCount = res.paginator.totalPages;
          this.currentPage = this.isAnyFilterActive
        ? 1
        : res.paginator.currentPage + 1;

      this.applyFilter();
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

   changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOffers();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadOffers();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadOffers();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.
    loadOffers();
  }

 applyFilter() {
  const term = this.searchTerm.toLowerCase().trim();

  this.filteredOffersList = this.offerList.filter((item) => {
    const matchesSearch =
      !term ||
      item.name?.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term);

    const matchesStatus =
      this.statusFilter === '' || item.status === this.statusFilter;

    return matchesSearch && matchesStatus;
  });

  this.updatePaginatedList();
}
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredOffersList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedOffersList = this.
      filteredOffersList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedOffersList = this.offerList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadOffers();
  }


}
