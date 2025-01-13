export interface IDashboardSidebarMenu {
  label: string;
  icon: string;
  link: string;
}

export interface IActionResponse<T = void> {
  data?: T;
  success: boolean;
  error?: string | string[];
}
