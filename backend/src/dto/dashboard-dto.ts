export interface BorrowHistories {
  count_borrow: number;
  borrow_at: string;
}

export interface GetDashboardInformationResponse {
  total_member: number;
  total_book: number;
  total_borrow: number;
  total_returned: number;
  total_borrowed: number;
  total_lated: number;
  borrow_histories: BorrowHistories[];
}
