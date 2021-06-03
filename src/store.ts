import { createStore, Commit, useStore as baseUseStore, Store } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { InjectionKey } from 'vue'
import { arrayToObject, objectToArray } from './hooks/help'

export interface ImageProps{
  url?:string;
  _id?:string;
  createdAt?: string
  fitUrl?:string
}
export interface ResponeseProps<T> {
  code: number,
  data: T,
  msg: string
}
export interface UserProps {
  isLogin:boolean;
  nickName?:string;
  _id?:string,
  column?: string;
  email?: string;
  avatar?: ImageProps,
  description?:string
}
export interface ColumnProps {
  _id:string;
  title:string;
  avatar?:ImageProps,
  description:string
}

export interface PostProps {
  _id?: string;
  title:string;
  content?:string;
  excerpt?:string
  image?:ImageProps|string;
  createdAt?:string;
  column: string;
  author?:string | UserProps
}
export interface ErrorProps{
  status:boolean,
  message?:string
}
interface listProps<P>{
  [id:string]:P
}

export interface GlobalColumnsProps{
  data: listProps<ColumnProps>;
  currentPage: number;
  total?:number
}
export interface GlobalPostsProps{
  data: listProps<PostProps>;
  loadedColumns: listProps<{total?: number; currentPage?: number}>;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GolbalProps {
  error:ErrorProps,
  token?:string,
  loading:boolean;
  columns: GlobalColumnsProps;
  posts: GlobalPostsProps;
  user:UserProps
}
// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<GolbalProps>> = Symbol()
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useStore() {
  return baseUseStore(key)
}

const asyncAndCommit = async (
  url: string,
  mutaionName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?:unknown
) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutaionName, { data, extraData })
  } else {
    commit(mutaionName, data)
  }
  return data
}

const store = createStore<GolbalProps>({
  state: {
    error: {
      status: false
    },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {} },
    user: {
      isLogin: false
    }
  },
  mutations: {
    createPost(state, payload) {
      state.posts.data[payload._id] = payload
    },
    fetchColumn(state, rowData) {
      const { list, count, currentPage } = rowData.data
      const { data } = state.columns
      state.columns = {
        data: { ...data, ...arrayToObject(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchOneColumn(state, rowData) {
      state.columns.data[rowData.data._id] = rowData.data
    },
    updateColumn(state, { data }) {
      state.columns.data[data._id] = data
    },
    fetchPosts(state, { data: rawData, extraData }) {
      const { data, loadedColumns } = state.posts
      const { list, count, currentPage } = rawData.data
      const listData = list as PostProps[]
      state.posts.data = { ...data, ...arrayToObject(listData) }
      loadedColumns[extraData] = {
        total: count,
        currentPage: currentPage
      }
    },
    fetchCurrentPost(state, rowData) {
      state.posts.data[rowData.data._id] = rowData.data
    },
    updatePost(state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id]
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    updateLoadingStatus(state, payload) {
      state.loading = payload
    },
    login(state, rowData) {
      const { token } = rowData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchUser(state, rowData) {
      state.user = { isLogin: true, ...rowData.data }
    },
    updateUser(state, { data }) {
      state.user = { isLogin: true, ...data }
    },
    logout(state) {
      state.token = ''
      localStorage.removeItem('token')
      state.user = { isLogin: false }
      delete axios.defaults.headers.common.Authorization
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objectToArray(state.posts.data).filter(post => post.column === cid).sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    },
    getPostsCountByCid: (state) => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].total
      } else {
        return 0
      }
    },
    getPostsCurrentPageByCid: (state) => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].currentPage
      } else {
        return 0
      }
    }
  },
  actions: {
    fetchColumn({ commit, state }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumn', commit)
      }
    },
    fetchOneColumn({ state, commit }, id) {
      const cIdArr = Object.keys(state.columns.data)
      if (!cIdArr.includes(id)) {
        return asyncAndCommit(`/columns/${id}`, 'fetchOneColumn', commit)
      }
    },
    fetchPosts({ state, commit }, params = {}) {
      const { cid, currentPage = 1, pageSize = 5 } = params
      const { loadedColumns } = state.posts
      const loadedCurentPage = (loadedColumns[cid] && loadedColumns[cid].currentPage) || 0
      if (!Object.keys(loadedColumns).includes(cid) || loadedCurentPage < currentPage) {
        return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          'fetchPosts', commit, { method: 'get' }, cid)
      }
    },
    login({ commit }, loginData) {
      return asyncAndCommit('/user/login', 'login', commit, {
        method: 'post',
        data: loginData
      })
    },
    fetchUser({ commit }) {
      return asyncAndCommit('/user/current', 'fetchUser', commit)
    },
    async loginAndFetch({ dispatch }, loginData) {
      await dispatch('login', loginData)
      return await dispatch('fetchUser')
    },
    createPost({ commit }, data) {
      return asyncAndCommit('/posts', 'createPost', commit, {
        method: 'post',
        data
      })
    },
    fetchCurrentPost({ state, commit }, id) {
      const { data } = state.posts
      const certainPost = data[id]
      if (!certainPost || !certainPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchCurrentPost', commit)
      } else {
        return Promise.resolve({ data: certainPost })
      }
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletepost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    updateColumn({ commit }, { id, payload }) {
      return asyncAndCommit(`/columns/${id}`, 'updateColumn', commit, { method: 'patch', data: payload })
    },
    updateUser({ commit }, { id, payload }) {
      return asyncAndCommit(`/user/${id}`, 'updateUser', commit, { method: 'patch', data: payload })
    }
  }
})

export default store
