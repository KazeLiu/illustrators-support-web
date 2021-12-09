<template>
  <div>
    <!--    <h3>添加</h3>-->
    <!--    <input type="text" placeholder="名称" v-model="name"/>-->
    <!--    <input type="text" placeholder="主页" v-model="home"/>-->
    <!--    <Button color="primary">添加</Button>-->
    <div>

    </div>
  </div>
</template>

<script>
import { GetIllustratorAll} from "../assets/js/RequestAll"
export default {
  name: "AddIllustrator",
  data() {
    return {
      name: null,
      home: null
    }
  },
  mounted() {
    this.test();
  },
  methods: {
    test() {
      GetIllustratorAll().then(data=>{
        debugger
      })
    }
  },
}
</script>

<style scoped>

</style>
