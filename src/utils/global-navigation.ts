// Shared utility file accessible by Host and Remotes
type NavigateFn = (url: string, as?: string, options?: any) => void;

let globalNavigate: NavigateFn = (url) => {
  window.location.href = url; // Fallback to hard reload if host router isn't attached yet
};

export const registerHostRouter = (routerPush: NavigateFn) => {
  globalNavigate = routerPush;
};

export const microNavigate = (url: string, as?: string, options?: any) => {
  globalNavigate(url, as, options);
};
