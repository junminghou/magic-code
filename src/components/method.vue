<template>
  <div>
    <div style="margin: 10px;">
      <!-- <i-select v-model="table" style="width:200px">
        <i-option v-for="item in tables" :value="item" :key="item">{{ item.description }}</i-option>
      </i-select> -->

      <i-button @click="changeCopyValue('get')">get</i-button>
      <i-button @click="changeCopyValue('post')">post</i-button>

    </div>
    <span>{{msg}}</span>
    
    <div style="display: none;">
      
    List{{_("SelfBuyOrderListDTO")}} myCommissionOrderList(Long userId, Integer commissionStatus, Integer pageIndex, Integer pageSize);
    ServiceResultBO{{_("FollowRoomPreCheckResBO")}} applyPreCheck(FollowRoomApplyPreCheckRequestBO checkRequest);
    List{{_("SelfBuyOrderListDTO")}} myCommissionOrderList(Long userId, Integer commissionStatus, Integer pageIndex, Integer pageSize);
    </div>

    <div id="class_member_script" ref="class_member_script">    
      private FollowRoomMemberActionManager actionManager;
    </div>

<!-- List{{_("FollowRoomMemberActionBO")}} findUploadImageList(Long roomId, Long fromMemberId); -->
<!-- Integer backstageApprovalFail(Long roomId, Long fromMemberId, Long toMemberId, Integer actionType, Long actionId); -->
    <div id="create_table_script" ref="create_table_script">                
        List{{_("FollowRoomUserLotteryBO")}} findLotteryList(Long roomId, Long userId);
    </div>

    <div id="publicClass" v-if="show.showClass" style="display:inline-flex;">

      <div style="margin-left: 10px;">
        <div class="publicClass TarzanBusiness">
          <pre>TarzanBusiness</pre>
          <!-- 方法头 -->
          <div>
                @Autowired <br/>
                private {{ toManager(member.memberType) }} {{toManager(member.memberName)}}; <br/>
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
                    {{showTab(2)}}List{{_(toBO(table.methodOutType.outTypeValue))}} listBO = {{toManager(member.memberName)}}.{{table.methodName}} (
                    <template v-for="(column,index) in table.methodInParams">
                      {{column.paramName}}
                      <template v-if="index !== (table.methodInParams.length-1)">,</template>
                    </template>);
                  </div>
                  <div>
                  {{showTab(2)}}listBO.stream().collect(Collectors.toMap({{toBO(table.methodOutType.outTypeValue)}}:, e -> e)); <br/> <br/>
                  {{showTab(2)}}return listBO.stream().map(this::convert).collect(Collectors.toList());
                  </div>

              </template>

              <template v-if="table.methodOutType.isBaseType">
                  <template v-if="getOrPost == 'get'">
                    {{showTab(2)}} return convert({{toManager(member.memberName)}}.{{table.methodName}} (
                    <template v-for="(column,index) in table.methodInParams">
                      {{column.paramName}}
                      <template v-if="index !== (table.methodInParams.length-1)">,</template>
                    </template>));
                  </template>
                  
                  <template v-if="getOrPost == 'post'">
                    {{showTab(2)}} return {{toVO(copyBean)}}({{toManager(member.memberName)}}.{{table.methodName}} (
                    <template v-for="(column,index) in table.methodInParams">
                      {{column.paramName}}
                      <template v-if="index !== (table.methodInParams.length-1)">,</template>
                    </template>), {{table.methodOutType.outTypeValue}}.class);
                  </template>
                  
              </template>    

            </div>          
            <div>
              }
            </div>


          </div>
          

          <div>
            <br/>
            public {{toVO(table.methodOutType.outTypeValue)}} convert({{toBO(table.methodOutType.outTypeValue)}} entity) { <br/>
            {{showTab(2)}}{{toVO(table.methodOutType.outTypeValue)}} result = BeanConverter.toBean(entity, {{toVO(table.methodOutType.outTypeValue)}}.class);<br/>
            {{showTab(2)}}return result;<br/>
            }
          </div>
          
        </div>

        <div class="publicClass TarzanManager">
          <pre>TarzanManager</pre>
          <!-- 方法头 -->
          <div>
                @DubboReference <br/>
                private {{ toService(member.memberType) }} {{toService(member.memberName)}}; <br/>
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
                  {{showTab(2)}}return BeanConverter.copyList(
                </template>
                <template v-if="table.methodOutType.isBaseType">
                  {{showTab(2)}}return {{toBO(copyBean)}}(
                </template>                     
                <br/>
                {{showTab(2)}}{{showTab(2)}}{{toService(member.memberName)}}.{{table.methodName}} (
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
                {{showTab(2)}}{{showTab(2)}}, {{toBO(table.methodOutType.outTypeValue)}}.class);                
                <br/>
              }
            </div>
          </div>
          
        </div>
      </div>

      <div style="margin-left: 20px;">
         <div class="publicClass ServiceAPI">
        <pre>ServiceAPI</pre>
        <!-- 方法头 -->
        <div>
          @Autowired <br/>
          private {{ toBusiness(member.memberType) }} {{toBusiness(member.memberName)}}; <br/>

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
                  {{showTab(2)}}return BeanConverter.copyList(
            </template>
            <template v-if="table.methodOutType.isBaseType">
                  {{showTab(2)}}return {{toDTO(copyBean)}}(
            </template>                     
          </div>
            <div>
                {{showTab(2)}}{{showTab(2)}}{{toBusiness(member.memberName)}}.{{table.methodName}} (
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
                {{showTab(2)}}{{showTab(2)}}, {{toDTO(table.methodOutType.outTypeValue)}}.class);                
          </div>
          <div>
            }
          </div>
        </div>
        
          </div>

          <div class="publicClass ServiceBusiness">
            <pre>ServiceBusiness</pre>
          @Autowired <br/>
          private {{ toBusiness(member.memberType) }} {{toBusiness(member.memberName)}};
          
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
                      {{showTab(2)}}return BeanConverter.copyList(
                </template>
                <template v-if="table.methodOutType.isBaseType">
                      {{showTab(2)}}return {{toBO(copyBean)}}(
                </template>                     
              </div>
                <div>
                    {{showTab(2)}}{{showTab(2)}} {{toBusiness(member.memberName)}}.{{table.methodName}} (
                    <span v-for="(column,index) in table.methodInParams">
                      {{column.paramName}}
                      <span v-if="index !== (table.methodInParams.length-1)">,</span>
                    </span>)
                    <div>
                    {{showTab(2)}}{{showTab(2)}}, {{toBO(table.methodOutType.outTypeValue)}}.class);
                    </div>
              </div>
              <div>
                }
              </div>
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
        copyBean:'BeanConverter.copy',
        member: {},
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
        getOrPost: '',
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
      // console.log(  );
      this.tables = dataConvert.getMethod(this.$refs.create_table_script.innerText, this.filter.columns);
      this.table = this.tables;
      this.member = dataConvert.getMemberVariable(this.$refs.class_member_script.innerText);
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
      showTab(count) {
          let result = "";
          for(let i=0; i<count; i++){
            result += "\u00a0\u00a0\u00a0";
          }
          return result + '\u00a0';
      },
      changeCopyValue(data){
          this.copyBean = data;
          this.show.showClass = true;
          if(data == 'get'){
            this.copyBean = 'BeanConverter.copy';
          } else {
            this.copyBean = 'ResultConverter.toVO';
          }
          this.getOrPost = data;
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
      },
      toManager(data){
        return data.replaceAll('Business','Manager').replaceAll('Service','Manager');
      },
      toBusiness(data){
        return data.replaceAll('Service','Business').replaceAll('Manager','Business');
      },
       toService(data){
        return data.replaceAll('Business','Service').replaceAll('Manager','Service');
      },
    }
  }
</script>


<style scoped>
  #create_table_script,#class_member_script {
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
