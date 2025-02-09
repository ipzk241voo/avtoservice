export interface Order {
    id: string;
    issue_date: Date;
    planned_completion_date: Date;
    actual_completion_date: Date;
    work_category: string;
    car_id: string;
    mechanic_id: string;
}