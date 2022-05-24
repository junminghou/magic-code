<template>
  <div>
    <i-select v-model="table" style="width:200px">
      <i-option v-for="item in tables" :value="item" :key="item">{{ item.description }}</i-option>
    </i-select>

    <i-button @click="showAction('showClass')">class me!</i-button>
    <i-button @click="showAction('showMapper')">mapper me!</i-button>
    <i-button @click="showAction('showService')">service me!</i-button>
    <i-button @click="showAction('showSetter')">setter me!</i-button>
    <!--<i-button @click="showAction('showEnum')">enum me!</i-button>-->
    <i-button @click="showAction('showOther')">mock me!</i-button>
    <i-button @click="showAction('showPythonSql')">python sql!</i-button>


    <span>{{msg}}</span>

    <div style="display: none;">
      

    </div>

    <div id="create_table_script" ref="create_table_script">
      
    List{{_("SelfBuyOrderListDTO")}} myCommissionOrderList(Long userId, Integer commissionStatus, Integer pageIndex, Integer pageSize);

    </div>

    <div id="publicClass" v-if="show.showClass">
      <div class="publicClass">
        <pre>Service</pre>
        <!-- 方法头 -->
        <div>
              <span> public {{table.methodOutType.outTypeSource}} {{table.methodName}} (</span>
               
                <template v-for="(column,index) in table.methodInParams">
                    {{column.paramType}} {{column.paramName}}
                    <span v-if="index !== (table.methodInParams.length-1)">,</span>
                </template>
              
              <span>) {</span>           
        </div>
        <!-- 方法体 -->
        <div>
          <div>
            <template v-if="table.methodOutType.isList">
                  &emsp;&emsp;return BeanConverter.copyList(
            </template>
            <template v-if="table.methodOutType.isBaseType">
                  &emsp;&emsp;return BeanConverter.copy(
            </template>                     
          </div>
            <div>
                &emsp;&emsp;&emsp;&emsp;&emsp;Business.{{table.methodName}} (
                <span v-for="(column,index) in table.methodInParams">
                  {{column.paramName}}
                  <span v-if="index !== (table.methodInParams.length-1)">,</span>
                </span>)
                <div>
                &emsp;&emsp;&emsp;&emsp;&emsp;, {{table.methodOutType.outTypeValue}}.class);
                </div>
          </div>
          <div>
            }
          </div>
        </div>
        
      </div>

      <div class="publicClass">
        <pre>TarzanManagerImpl</pre>
        <!-- 方法头 -->
        <div>
              <span> public {{toBO(table.methodOutType.outTypeSource)}} {{table.methodName}} (</span>
               
                <template v-for="(column,index) in table.methodInParams">
                    {{column.paramType}} {{column.paramName}}
                    <span v-if="index !== (table.methodInParams.length-1)">,</span>
                </template>
              
              <span>) {</span>           
        </div>
        <!-- 方法体 -->
        <div>
          <div>
            <template v-if="table.methodOutType.isList">
                  &emsp;&emsp;return BeanConverter.copyList(
            </template>
            <template v-if="table.methodOutType.isBaseType">
                  &emsp;&emsp;return BeanConverter.copy(
            </template>                     
          </div>
            <div>
                &emsp;&emsp;&emsp;&emsp;&emsp;Service.{{table.methodName}} (
                <span v-for="(column,index) in table.methodInParams">
                  {{column.paramName}}
                  <span v-if="index !== (table.methodInParams.length-1)">,</span>
                </span>)
                <div>
                &emsp;&emsp;&emsp;&emsp;&emsp;, {{toBO(table.methodOutType.outTypeValue)}}.class);
                </div>
          </div>
          <div>
            }
          </div>
        </div>
        
      </div>



    </div>
  </div>
</template>


<script>
  import {dataConvert} from '../javaService.js'
  import ISelect from "iview/src/components/select/select";
  import IOption from "iview/src/components/select/option";
import { fail } from 'assert';

  export default {
    components: {
      IOption,
      ISelect
    },
    name: 'method',
    data() {
      return {
        visible: false,
        msg: '',
        table: '',
        tables: '',
        filter: {
          columns: ['gmt_create', 'gmt_modify']
        },
        tempStr: '&lt;:<, &gt;:>, &lt;&gt;:<>, &amp;:&, &apos;:\', &quot;:"',
        quot: '\\"\\"',
        show: {
          showClass: false,
          showMapper: false,
          showService: false,
          showSetter: false,
          showEnum: false,
          showOther: false,
          showPythonSql: false,
        },
        setter: {
          from: 'from',
          to: 'to',
        },
        enumData: {
          name: '',
          values: ''
        },
        magic: {
          magicReturn: ''
        }
      };
    },
    mounted() {
      // console.log( this.$refs.create_table_script.innerText );
      this.tables = dataConvert.getMethod(this.$refs.create_table_script.innerText, this.filter.columns);
      this.table = this.tables;
    },
    methods: {
      _(value) {
        return "<" + value + ">";
      },
      before(symbol, index) {
        if (index === 0) {
          return symbol;
        }
      },
      after(symbol, index, length) {
        if (index < length - 1) {
          return symbol;
        }
      },
      showAction: function (data) {
        for (let property in this.show) {
          if (data === property) {
            this.show[property] = true;
          } else {
            this.show[property] = false;
          }
        }
      },
      magicReturn(data) {
        if (this.magic.magicReturn !== '') {
          return this.magic.magicReturn + '<' + data + '>';
        }
        return data;
      },
      toBO(data){
        return data.replace('DTO','BO');
      }
    }
  }
</script>


<style scoped>
  #create_table_script {
    display: none;
  }

  #setter {
    margin: 10px;
  }

  .setterContent {
    margin-top: 10px;
  }

  #publicClass,#publicMapper,#publicService{
    margin: 10px;
  }
</style>
