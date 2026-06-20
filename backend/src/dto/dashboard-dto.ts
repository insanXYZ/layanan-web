export interface BorrowHistories {
  count_borrow: number;
  borrow_at: string;
}

export interface GetDashboardInformationResponse {
  count_member: number;
  count_book: number;
  count_borrow: number;
  total_returned: number;
  total_borrowed: number;
  total_lated: number;
  borrow_histories: BorrowHistories[];
}
