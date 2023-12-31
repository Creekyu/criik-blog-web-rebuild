import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// comp
import LinkBtn2 from '@/components/Universal/LinkBtn2';
import Avatar from '@/components/TopHeader/Avatar';
import ElasticSearch from '@/components/ElasticSearch';

// antd
import { Popconfirm } from 'antd';
import { FrownTwoTone } from '@ant-design/icons';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// gloabl
import { BREAK_POINT } from '@/global';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setLoginFormOpen, setThemeMode } from '@/redux/slices/universal';
import { setUser } from '@/redux/slices/user';
import { logout } from '@/apis/user';
import { hasUser } from '@/utils';

const RightNav = () => {
  const message = useGlobalMessage();
  const { width } = useViewport();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // state
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const user = useAppSelector(state => state.user.user);

  // handle log out
  const handleLogout = useCallback(async () => {
    // 移除session
    await logout();
    await message.loadingSuccessAsync('登出中...', '成功退出登录！');
    // await可以让按钮进入加载状态
    dispatch(setUser(null));
    navigate(0);
  }, []);

  return (
    <div className={style.rightNav}>
      {width > BREAK_POINT ? (
        <>
          {/* 全文搜索 */}
          <div className={style.es}>
            <ElasticSearch></ElasticSearch>
          </div>
          {/* 黑暗模式 */}
          <div
            className={`${style.themeMode} iconfont  ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}
            onClick={() => {
              dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'));
            }}
          >
            {themeMode === 'light' ? <span>&#xe655;</span> : <span>&#xe62c;</span>}
          </div>
        </>
      ) : undefined}

      {/* 是否登录判断 */}
      {hasUser(user) ? (
        <>
          {/* 登录了显示logout */}
          <Popconfirm
            placement="bottom"
            title={'是否要Log Out？'}
            icon={<FrownTwoTone />}
            okText="Yes"
            cancelText="No"
            onConfirm={handleLogout}
          >
            <LinkBtn2 className={style.logOut}>Log out</LinkBtn2>
          </Popconfirm>
        </>
      ) : (
        //   没登录显示登录
        <div className={style.signWrapper}>
          <LinkBtn2
            onClick={() => {
              dispatch(setLoginFormOpen(true));
            }}
          >
            Sign in
          </LinkBtn2>
        </div>
      )}
      {/*  菜单栏选项 */}
      <Avatar></Avatar>
    </div>
  );
};

export default RightNav;
