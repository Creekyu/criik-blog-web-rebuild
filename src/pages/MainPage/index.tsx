import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

// antd
import { Layout } from 'antd';
import { Header } from 'antd/es/layout/layout';

const { Content } = Layout;

// css
import style from './index.module.scss';

// 组件
import TopHeader from '@/components/TopHeader';
import ProgressBar from '@/components/ProgressBar';
import BackToTopBtn from '@/components/Universal/BackToTopBtn';
import LoginForm from '@/components/TopHeader/LoginForm';
import InitLoading from '@/components/Loading/InitLoading';
import Announcement from '@/components/Announcement';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setEmoji } from '@/redux/slices/emoji';
import { setMenuList } from '@/redux/slices/blogMenu';
import { setMyBlogsNum } from '@/redux/slices/blog';
import { setLoginFormOpen } from '@/redux/slices/universal';

// TODO:后续可以做一个类似笔记的功能，选中的文本可以做标记等等
const MainPage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const themeMode = useAppSelector(state => state.universal.themeMode);
  const loginFormOpen = useAppSelector(state => state.universal.loginFormOpen);

  const [open, setOpen] = useState(true);
  const [announceOpen, setAnnounceOpen] = useState(false);
  const [isNavLoad, setIsNavLoad] = useState(false);

  useEffect(() => {
    // 加载后先把emoji请求回来，后面不再请求了
    dispatch(setEmoji());
    // 请求MyMenu
    dispatch(setMenuList());
    // 获取我的博客数
    dispatch(setMyBlogsNum());
    dispatch(setLoginFormOpen(false));
    // loading
    setTimeout(() => {
      setOpen(false);
      setIsNavLoad(true);
      setTimeout(() => {
        setAnnounceOpen(true);
      }, 300);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!open) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 500);
    }
  }, [location.pathname]);

  return (
    <Layout>
      <TopHeader></TopHeader>
      <Announcement
        open={announceOpen}
        setOpen={flag => {
          setAnnounceOpen(flag);
        }}
      />
      {/* Login界面，这里放这是因为css的backdrop-filter在使用了position:fixed以后只对其父元素生效 */}
      {loginFormOpen ? <LoginForm></LoginForm> : undefined}
      <div
        className={style.progress}
        style={{
          backgroundColor: themeMode === 'light' ? undefined : 'rgba(0, 0, 0, .7)',
        }}
      >
        <ProgressBar></ProgressBar>
      </div>
      <Header className={`${style.backWhite} ${themeMode === 'dark' ? style.dark : style.light}`}></Header>
      <Layout>
        <Content>
          <React.StrictMode>
            {/* Loading */}
            <InitLoading open={open} isNavLoad={isNavLoad}></InitLoading>
            <BackToTopBtn></BackToTopBtn>
            <Outlet />
          </React.StrictMode>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPage;
