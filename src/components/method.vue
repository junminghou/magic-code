<template>
  <div>
    <i-select v-model="table" style="width:200px">
      <i-option v-for="item in tables" :value="item" :key="item">{{ item.description }}</i-option>
    </i-select>

    <i-button @click="showAction('showClass')">get</i-button>
    <i-button @click="showAction('showMapper')">post</i-button>
    <i-button @click="showAction('showService')">service me!</i-button>
    <i-button @click="showAction('showSetter')">setter me!</i-button>
    <!--<i-button @click="showAction('showEnum')">enum me!</i-button>-->
    <i-button @click="showAction('showOther')">mock me!</i-button>
    <i-button @click="showAction('showPythonSql')">python sql!</i-button>


    <span>{{msg}}</span>

    <div style="display: none;">
      
    List{{_("SelfBuyOrderListDTO")}} myCommissionOrderList(Long userId, Integer commissionStatus, Integer pageIndex, Integer pageSize);
    </div>



    <div id="create_table_script" ref="create_table_script">
      
    

    ServiceResultBO{{_("FollowRoomPreCheckResBO")}} applyPreCheck(FollowRoomApplyPreCheckRequestBO checkRequest);

    </div>

    <div id="publicClass" v-if="show.showClass">

      <div class="publicClass BusinessOfService">
        <pre>BusinessOfService</pre>
        <!-- 方法头 -->
        <div>
              @Override <br/>
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
                &emsp;&emsp;&emsp;&emsp;&emsp; xxxManager.{{table.methodName}} (
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

      <div class="publicClass Service">
        <pre>Service</pre>
        <!-- 方法头 -->
        <div>
              @Override <br/>
              <span> public {{toDTO(table.methodOutType.outTypeSource)}} {{table.methodName}} (</span>
               
                <template v-for="(column,index) in table.methodInParams">
                    <template v-if="column.paramDefinition.isBaseType">                                
                    {{column.paramType}} {{column.paramName}}
                    </template>
                    <template v-else>                    
                    {{toDTO(column.paramType)}} {{column.paramName}}
                    </template>
                    <template v-if="index !== (table.methodInParams.length-1)">,</template>
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
                <template v-for="(column,index) in table.methodInParams">
                  <template v-if="column.paramDefinition.isBaseType">
                    {{column.paramName}}
                  </template>
                   <template v-else>
                    BeanConverter.copy({{column.paramName}}, {{toBO(column.paramType)}}.class)
                  </template>
                  <template v-if="index !== (table.methodInParams.length-1)">,</template>
                </template>)
                <br/>
                &emsp;&emsp;&emsp;&emsp;&emsp;, {{toDTO(table.methodOutType.outTypeValue)}}.class);                
          </div>
          <div>
            }
          </div>
        </div>
        
      </div>

      <div class="publicClass TarzanManager">
        <pre>TarzanManager</pre>
        <!-- 方法头 -->
        <div>
              @Override <br/>
              <span> public {{toBO(table.methodOutType.outTypeSource)}} {{table.methodName}} (</span>
               
                <template v-for="(column,index) in table.methodInParams">
                    <template v-if="column.paramDefinition.isBaseType">                                
                    {{column.paramType}} {{column.paramName}}
                    </template>
                    <template v-else>                    
                    {{toBO(column.paramType)}} {{column.paramName}}
                    </template>
                    <template v-if="index !== (table.methodInParams.length-1)">,</template>
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
              <br/>
              &emsp;&emsp;&emsp;&emsp;&emsp;Service.{{table.methodName}} (
              <template v-for="(column,index) in table.methodInParams">
                  <template v-if="column.paramDefinition.isBaseType">
                  {{column.paramName}}
                  </template>
                  <template v-else>
                  BeanConverter.copy({{column.paramName}}, {{toDTO(column.paramType)}}.class)
                  </template>
                  <template v-if="index !== (table.methodInParams.length-1)">,</template>
              </template>)
              <br/>
              &emsp;&emsp;&emsp;&emsp;&emsp;, {{toBO(table.methodOutType.outTypeValue)}}.class);                
              <br/>
            }
          </div>
        </div>
        
      </div>


      <div class="publicClass">
        <pre>TarzanBusiness</pre>
        <!-- 方法头 -->
        <div>
              @Override <br/>
              <span> public {{toVO(table.methodOutType.outTypeSource)}} {{table.methodName}} (</span>
               
                <template v-for="(column,index) in table.methodInParams">
                    <template v-if="column.paramDefinition.isBaseType">                                
                    {{column.paramType}} {{column.paramName}}
                    </template>
                    <template v-else>                    
                    {{toBO(column.paramType)}} {{column.paramName}}
                    </template>
                    <template v-if="index !== (table.methodInParams.length-1)">,</template>
                </template>
              
              <span>) {</span>           
        </div>
        <!-- 方法体 -->
        <div>
          <div>
            
            <template v-if="table.methodOutType.isList">
                <div>
                  &emsp;&emsp;List{{_(toBO(table.methodOutType.outTypeValue))}} listBO = xxxManager.{{table.methodName}} (
                  <template v-for="(column,index) in table.methodInParams">
                    {{column.paramName}}
                    <template v-if="index !== (table.methodInParams.length-1)">,</template>
                  </template>);
                </div>
                <div>
                &emsp;&emsp;return listBO.stream().map(this::convert).collect(Collectors.toList());
                </div>

            </template>

            <template v-if="table.methodOutType.isBaseType">
                  &emsp;&emsp; return convert(xxxManager.{{table.methodName}} (
                  <template v-for="(column,index) in table.methodInParams">
                    {{column.paramName}}
                    <template v-if="index !== (table.methodInParams.length-1)">,</template>
                  </template>));
            </template>    

          </div>          
          <div>
            }
          </div>


        </div>
        

        <div>
          <br/>
          public {{toVO(table.methodOutType.outTypeValue)}} convert({{toBO(table.methodOutType.outTypeValue)}} entity) { <br/>
          &emsp;&emsp;{{toVO(table.methodOutType.outTypeValue)}} result = BeanConverter.toBean(entity, {{toVO(table.methodOutType.outTypeValue)}}.class);<br/>
          &emsp;&emsp;return result;<br/>
          }
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
        return data.replaceAll('DTO','BO').replaceAll('VO','BO');
      },
      toVO(data){
        return data.replaceAll('DTO','VO').replaceAll('BO','VO');
      },toDTO(data){
        return data.replaceAll('VO','DTO').replaceAll('BO','DTO');
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
