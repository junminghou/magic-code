<template>
    <div>        
        <template v-for="column in params">
            <template v-if="column.paramType == 'Long'">
                {{_tab(2)}}if (null == {{column.paramName}} || {{column.paramName}}.equals(0L)) { <br>
                {{_tab(4)}}return Collections.{{mapOrList()}}(); <br>
                {{_tab(2)}}} <br>
            </template>
            <template v-else-if="column.paramType == 'Integer'">
                {{_tab(2)}}if (null == {{column.paramName}} || {{column.paramName}}.equals(0)) { <br>
                {{_tab(4)}}return Collections.{{mapOrList()}}(); <br>
                {{_tab(2)}}} <br>
            </template>
            <template v-if="column.paramType == 'String'">
                {{_tab(2)}}if (StringUtils.isBlank({{column.paramName}})) { <br>
                {{_tab(4)}}return Collections.{{mapOrList()}}();<br>
                {{_tab(2)}}} <br>
            </template>
        </template>
    </div>    
</template>
<script>
export default {    
    props: {
        title: String,
        params: Array,
        methodOutType: String
    },
    data() {
      return {
        
      }
    },
    mounted() {
      
    },
    methods: {
        _tab(count) {
          let result = "";
          for(let i=0; i<count; i++){
            result += "\u00a0\u00a0\u00a0";
          }
          return result + '\u00a0';
      },
      mapOrList() {
        if(this.$props.methodOutType == "List"){
            return "emptyList";
        }
        if(this.$props.methodOutType == "Map"){
            return "emptyMap";
        }
      }
    }
}
</script>