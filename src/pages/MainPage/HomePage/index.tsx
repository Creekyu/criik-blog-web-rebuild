import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router';

// antd
import { Pagination } from 'antd';

// css
import style from './index.module.scss';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';
import { setIsLoading } from '@/redux/slices/progressbar';
import { setMobileMenuOpen } from '@/redux/slices/universal';

// comp
import IntroductionBox from '@/components/HomePage/IntroductionBox';
import BlogDetailBox from '@/components/HomePage/BlogDetailBox';
import Footer from '@/components/Footer';
import MobileTopBtn from '@/components/Universal/MobileTopBtn';

// global
import { BREAK_POINT } from '@/global';

const HomePage = () => {
  const navigate = useNavigate();
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const [search] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(search.get('page') ? parseInt(search.get('page') as string) : 1);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const totalNum = useAppSelector(state => state.blog.blogsNum);
  const themeMode = useAppSelector(state => state.universal.themeMode);

  const homePhotoWrapper = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 导入随机背景图片
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    import(`@/assets/images/homephoto-${randomNumber}.webp`).then(imageModule => {
      if (!backgroundImage) setBackgroundImage(imageModule.default);
    });
    // 重置mobile open
    dispatch(setMobileMenuOpen(false));
    // 设置导航
    dispatch(setChosenList([true, false, false, false]));
    // 回滚
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // 如果先前打开了滚动条要先关闭
    dispatch(setIsLoading(false));
    setTimeout(() => {
      dispatch(setIsLoading(true));
    }, 50);
  }, []);

  useEffect(() => {
    // 设置photo大小
    if (width > BREAK_POINT) homePhotoWrapper.current!.style.height = `${window.innerHeight - 50}px`;
  }, [width]);

  const handleChange = (page: number) => {
    window.scrollTo({
      top: parseInt(window.getComputedStyle(homePhotoWrapper.current as HTMLDivElement).height) + 0.5,
      behavior: 'smooth',
    });
    setLoading(true);
    setTimeout(() => {
      // 点击跳转
      navigate(`?page=${page}`);
      setCurPage(page);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <div
        className={`${style.wrapper} clearfix  show-anime-delay-1s ${
          themeMode === 'dark' ? 'dark' : style.wrapperLight
        }`}
      >
        <div
          className={`${style.backgroundPhoto} clearfix`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
          ref={homePhotoWrapper}
        >
          <div className={style.homeTagWrapper}>
            <div className={style.homeTag}>𝓒𝓻𝓲𝓲𝓴𝔂𝓞</div>
            <div>Always Be Yourself and Never Compromise to the Life</div>
          </div>
        </div>
        <div className={`${style.main} clearfix`} ref={divRef}>
          <div className={`${style.content} transBase ${loading ? 'transHide' : ''}`}>
            <div className={style.blogList}>
              <Outlet />
            </div>
            <div className={style.paginate}>
              <Pagination
                showSizeChanger={false}
                showQuickJumper
                pageSize={10}
                current={curPage}
                total={totalNum}
                onChange={handleChange}
              />
            </div>
          </div>
          {width > 1138 ? (
            <div className={style.sider}>
              <div>
                <IntroductionBox></IntroductionBox>
                <BlogDetailBox></BlogDetailBox>
              </div>
            </div>
          ) : undefined}
        </div>
        <Footer></Footer>
      </div>
      {/* Mobile Menu */}
      <MobileTopBtn>
        <BlogDetailBox isMobile></BlogDetailBox>
      </MobileTopBtn>
    </>
  );
};
export default HomePage;
