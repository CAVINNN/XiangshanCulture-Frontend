import Vue from 'vue'
import Router from 'vue-router'

import Index from '../components/Index'
import Show from '../components/Show'
import Search from '../components/Search'
import KnowledgeSearch from '../components/search/KnowledgeSearch'
import RelationSearch from '../components/search/RelationSearch'
import AttributeSearch from '../components/search/AttributeSearch'
import TimeSpaceSearch from '../components/search/TimeSpaceSearch'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
      meta: {
        needLogin: false
      }
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      meta: {
        needLogin: false
      }
    },
    {
      path: '/show',
      name: 'show',
      component: Show,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: '/search/knowledgeSearch',
          component: KnowledgeSearch,
          meta: {
            needLogin: true
          }
        },
        {
          path: '/search/relationSearch',
          component: RelationSearch,
          meta: {
            needLogin: true
          }
        },
        {
          path: '/search/attributeSearch',
          component: AttributeSearch,
          meta: {
            needLogin: true
          }
        },
        {
          path: '/search/timeSpaceSearch',
          component: TimeSpaceSearch,
          meta: {
            needLogin: true
          }
        }
      ]
    }
  ]
})
