// /components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './Header.module.css';

interface HeaderProps {
  userName: string | null;
  userDepartment: string | null;
  userId?: string | null;
}

export default function Header({ userName, userDepartment, userId }: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const userLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  // スタイルを確実に適用するためのマウントチェック
  if (!mounted) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.navFlex}>
            <div className={styles.logoSection}>
              <span className={styles.logoText}>就活管理アプリ</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navFlex}>
          <div className={styles.logoSection}>
            <Link href="/dashboard" className={styles.logoText}>
              First Carreer
            </Link>
            <nav className={styles.navLinks}>
              <Link href="/es" className={styles.navLink}>
                ES
              </Link>
              <Link href="/interview" className={styles.navLink}>
                面接
              </Link>
              <Link href="/coding-test" className={styles.navLink}>
                コーディングテスト
              </Link>
            </nav>
          </div>

          <div className={styles.userSection}>
            {userName && (
              <div className={styles.userMenu}>
                <button
                  onClick={toggleMenu}
                  className={styles.userButton}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  <div className={styles.avatar}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{userName}</span>
                  <svg 
                    className={`${styles.arrow} ${isMenuOpen ? styles.arrowUp : ''}`}
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{userName}</p>
                      <p className={styles.dropdownDept}>{userDepartment}</p>
                    </div>
                    {userId && (
                      <button
                        onClick={() => {
                          router.push(`/user/${userId}`);
                          setIsMenuOpen(false);
                        }}
                        className={styles.dropdownItem}
                      >
                        マイページ
                      </button>
                    )}
                    <button
                      onClick={userLogout}
                      className={`${styles.dropdownItem} ${styles.logoutButton}`}
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
