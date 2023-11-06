import service, { client, Result } from '@/utils/request';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface
import { TextContentObj } from '@/interface';
import { Blog, BlogTimeLineObj, BlogTimeLineRes } from '@/apis/blog';

interface blogInitObj {
  primBlog: Blog;
  writeContent: TextContentObj;
  isEdit: boolean; // 标志博客是否处于编辑状态，处于编辑状态则提交按钮变为更新
  timeLine: BlogTimeLineObj[];
  blogsNum: number;
  likeList: number[]; // 点赞列表，记录当前点赞过的博客
  chosen: number; // 精选页面chosen
  curEditId: number; // 当前正在编辑的id
  curBlogContent: string; // 当前选中博客内容，用于toc
}

// 合并了菜单的slice因为无法解决设置了selectedId后设置curBlog延迟的问题
const initialState: blogInitObj = {
  primBlog: {} as Blog,
  writeContent: {} as TextContentObj,
  isEdit: false, // 标志博客是否处于编辑状态，处于编辑状态则提交按钮变为更新
  timeLine: [] as BlogTimeLineObj[],
  blogsNum: 0,
  likeList: [] as number[],
  chosen: 0,
  curEditId: 0,
  curBlogContent: '',
};

interface BlogCountResult {
  count: number;
}

export const setTimeLine = createAsyncThunk('blog/setTimeLine', async () => {
  return client.get<Result<BlogTimeLineRes>>('/api/blog/criiky0/timeline');
});

export const setMyBlogsNum = createAsyncThunk('blog/getMyBlogsNum', async () => {
  return await client.get<Result<BlogCountResult>>('/api/blog/criiky0/count');
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // curBlogContent
    setCurBlogContent: (state, action) => {
      state.curBlogContent = action.payload;
    },
    setCurEditId: (state, action) => {
      state.curEditId = action.payload;
    },
    // chosen
    setChosen: (state, action) => {
      state.chosen = action.payload;
    },
    // likeList
    addLikeList: (state, action) => {
      state.likeList = [...state.likeList, action.payload];
    },
    removeLikeList: (state, action) => {
      state.likeList = state.likeList.filter(id => id !== action.payload);
    },
    // isEdit
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    // writeContent
    setTitle: (state, action) => {
      state.writeContent.title = action.payload;
    },
    setMenuId: (state, action) => {
      state.writeContent.menuId = action.payload;
    },
    setMenuTitle: (state, action) => {
      state.writeContent.menuTitle = action.payload;
    },
    setContent: (state, action) => {
      state.writeContent.content = action.payload;
    },
    initWriteContent: state => {
      state.writeContent = {
        title: '',
        menuId: 0,
        menuTitle: '',
        content: '',
      };
    },
    setAllContent: (state, action) => {
      state.writeContent = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setTimeLine.fulfilled, (state, action) => {
        state.timeLine = [...action.payload.data.timeline];
      })
      .addCase(setTimeLine.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(setMyBlogsNum.fulfilled, (state, action) => {
        state.blogsNum = action.payload.data.count;
      })
      .addCase(setMyBlogsNum.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const {
  setCurBlogContent,
  setCurEditId,
  setChosen,
  addLikeList,
  removeLikeList,
  setIsEdit,
  setTitle,
  setMenuTitle,
  setMenuId,
  setContent,
  initWriteContent,
  setAllContent,
} = blogSlice.actions;
export default blogSlice.reducer;
