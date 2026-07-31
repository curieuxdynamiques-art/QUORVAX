import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// 类型安全的导航工具，替代 next/link 和 next/navigation 的 usePathname / useRouter
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
