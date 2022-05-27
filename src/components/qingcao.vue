<template>
  <div>
    <i-select v-model="table" style="width:200px">
      <i-option v-for="item in tables" :value="item" :key="item">{{ item.description }}</i-option>
    </i-select>

    <i-button @click="showAction('showClass')">class me!</i-button>
    <i-button @click="showAction('showMapper')">manager me!</i-button>
    <i-button @click="showAction('showService')">service me!</i-button>
    <i-button @click="showAction('showSetter')">setter me!</i-button>
    <!--<i-button @click="showAction('showEnum')">enum me!</i-button>-->
    <i-button @click="showAction('showOther')">mock me!</i-button>
    <i-button @click="showAction('showPythonSql')">python sql!</i-button>
    <i-button @click="clearClickFileds()">clearClickFileds</i-button>


    <span>{{msg}}</span>

    <div style="display: none;">


    </div>

    <div id="columns" style=" margin: 10px;">
         <template v-for="column in table.columns" >          
            <div style=' width: 200px; display: inline-block; margin-top:10px;margin-bottom:5px;' >
              <div @click="pushField(column,1)" style="display: inline-block; cursor:pointer;">getOrWhere</div> 
              <div @click="pushField(column,2)" style="display: inline-block; cursor:pointer; ">setOrSelect</div>
              <div @click="pushField(column,3)" style="display: inline-block; cursor:pointer; ">orderBy</div>
              <div style=""> {{column.pascalName}} </div>              
            </div>
        </template>
    </div>

    <div id="create_table_script" ref="create_table_script">

-- auto-generated definition
create table task_hire_publish
(
    id                        bigint unsigned auto_increment
        primary key,
    user_id                   bigint unsigned  default 0                 not null comment '发布任务的uid',
    app_type                  int unsigned     default 0                 not null comment 'app类型 0 轻抖APP 1 轻草提词器 2 轻草',
    task_status               tinyint unsigned default 0                 not null comment '任务状态',
    task_platform_id          int unsigned     default 0                 not null comment '任务平台ID',
    task_type_id              int unsigned     default 0                 not null comment '任务类型ID',
    flag                      int unsigned     default 0                 not null comment '特殊标识位0:无 1:抖音平台',
    publish_service_fee_ratio int unsigned     default 0                 not null comment '发布者服务费率,万分比',
    apply_service_fee_ratio   int unsigned     default 0                 not null comment '接单人服务费率，万分比',
    credit_day                int unsigned     default 0                 not null comment '接单人完成后账期,单位为天',
    service_fee               bigint unsigned  default 0                 not null comment '发布者服务费,单位为分,出现厘多收到分',
    publish_service_fee_flag  int unsigned     default 0                 not null comment '发布者服务费收取标识位',
    task_money_per            bigint unsigned  default 0                 not null comment '单次任务赏金',
    send_money_count          int              default 0                 not null comment '已经打款的报名数量',
    task_money_all            bigint unsigned  default 0                 not null comment '任务总金额（分为单位）',
    task_money_all_pay        bigint unsigned  default 0                 not null comment '发布任务总支付金额(分为单位)',
    task_content              varchar(2048)    default ''                not null comment '任务要求',
    task_apply_limit          int unsigned     default 0                 not null comment '任务报名人数限制（总名额）',
    task_apply_progress       int unsigned     default 0                 not null comment '任务报名进度对应人数（已通过）',
    task_apply_all            int unsigned     default 0                 not null comment '任务报名成功总数',
    task_publish_time         int(11) unsigned default 0                 not null comment '任务发布时间',
    task_cancel_time          int(11) unsigned default 0                 not null comment '任务取消时间 用户手动终止任务时间',
    task_start_time           int(11) unsigned default 0                 not null comment '任务开始时间',
    task_end_time             int(11) unsigned default 0                 not null comment '任务结束时间',
    task_fans_require         bigint unsigned  default 0                 not null comment '粉丝数要求',
    task_image                varchar(1024)    default ''                not null comment '任务图片JSON结构数据',
    task_link                 varchar(8192)    default ''                not null comment '任务链接JSON结构数据',
    task_phone                varchar(32)      default ''                not null comment '任务联系手机',
    is_open_phone             tinyint unsigned default 0                 not null comment '0 允许对方电话联系 1允许',
    price_plus_weight         bigint unsigned  default 0                 not null comment '单价排序权重字段',
    reject_reason             varchar(2048)    default ''                not null comment '审核不通过原因',
    ai_verify_status          int(10)          default 0                 not null comment '机审状态',
    ai_verify_time            int(11) unsigned default 0                 not null comment '机审时间戳',
    coin_return_flag          int unsigned     default 0                 not null comment '任务终止轻币是否处理flag 0 未处理  1已处理',
    thumbs_up_count           bigint unsigned  default 0                 not null comment '好评数',
    thumbs_down_count         bigint unsigned  default 0                 not null comment '差评数',
    create_time               datetime         default CURRENT_TIMESTAMP not null,
    update_time               datetime         default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    is_deleted                tinyint          default 0                 not null
)
    comment '牛人任务表';


    </div>

    <div id="publicClass" v-if="show.showClass">
      <div class="publicClass">
        <div>
          public class {{table.pascalName}} {
        </div>
        <br/>
        <div v-for="column in table.columns">
          /** <br>
          * {{column.description}}<br>
          */<br>
          <span> private {{column.dataType}} {{column.camelName}};</span>
        </div>

        <div>
          }
        </div>
      </div>

      <div class="publicClassQuery">
        public class {{table.pascalName}}Query extends {{table.pascalName}} {
        <br/>
        <template v-for="column in table.columns">
          <template v-if="column.dataType === 'String'">
            private {{column.dataType}} like{{column.pascalName}};
            <br/>
          </template>
        </template>
        }
      </div>
    </div>

  <div id="publicMapper" v-if="show.showMapper" style="display: inline-flex;padding-top: 20px;">

    <div >
 
    <template>
        @Override<br/>
        public List{{_(table.pascalName+"BO")}} findList(
          <template v-for="(column,index) in clickedFields">
            {{column.dataType}} {{column.camelName}}
            <template v-if="index !== (clickedFields.length-1)">,</template>
          </template>) {<br/>
          
          <template v-for="column in clickedFields">

            <template v-if="column.dataType == 'Long'">
               if ({{column.camelName}} == null || {{column.camelName}}.equals(0L)) { <br/>
              {{showTab(2)}}{{showTab(2)}}return Collections.emptyList(); <br/>
              {{showTab(2)}}} <br/>
            </template>
            
             <template v-if="column.dataType == 'Integer'">
              {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0)) { <br/>
              {{showTab(2)}}{{showTab(2)}}return Collections.emptyList(); <br/>
              {{showTab(2)}}} <br/>
            </template>
            
              <template v-if="column.dataType == 'String'">
                {{showTab(2)}}if (StringUtils.isBlank({{column.camelName}})) { <br/>
                {{showTab(2)}}{{showTab(2)}}return Collections.emptyList();<br/>
                {{showTab(2)}}}<br/>
            </template>
          </template>
         <br/>

            {{showTab(2)}}Example example = new Example({{table.pascalName}}PO.class);<br/>
            {{showTab(2)}}example.createCriteria()<br/>
            <template v-for="(column,index) in whereFields">
              <div>
                {{showTab(2)}}{{showTab(2)}}.andEqualTo("{{column.camelName}}", {{column.camelName}})
                 <template v-if="index === (whereFields.length-1)">;</template>
              </div>
            </template>          
            <template v-if="orderFields.length>0">
            {{showTab(2)}}example.setOrderByClause("
              <template v-for="(column,index) in orderFields">
              {{column.name}} desc
               <template v-if="index !== (orderFields.length-1)">,</template>
              </template>
              ");
            </template>
            <br/>
            <br/>
            {{showTab(2)}}List{{_(table.pascalName+"PO")}} {{table.camelName}}List = mapper.selectByExample(example);<br/>
            {{showTab(2)}}if (CollectionUtils.isEmpty({{table.camelName}}List)) {<br/>
                {{showTab(2)}}{{showTab(2)}}return Collections.emptyList();<br/>
            {{showTab(2)}}}<br/>
            {{showTab(2)}}return BeanConverter.copyList({{table.camelName}}List, {{table.pascalName}}BO.class);<br/>
        }<br/>
    </template>

      <br/>
    <template>
    @Override<br/>
    public {{table.pascalName}}BO findById({{table.primaryKeyType}} id) {<br/>
    {{showTab(2)}}if (id == null) {<br/>
    {{showTab(2)}}&nbsp;return null;<br/>
    {{showTab(2)}}}<br/>
    {{showTab(2)}}return BeanConverter.copy(mapper.selectByPrimaryKey(id), {{table.pascalName}}BO.class);<br/>
    }<br/>
    </template>

     <br/>
    <template>
    @Override<br/>
    public List{{_(table.pascalName+"BO")}} findByIds(List{{_(table.primaryKeyType)}} ids) {<br/>
    {{showTab(2)}}if (CollectionUtils.isEmpty(ids)) {<br/>
    {{showTab(2)}}&nbsp;return Collections.emptyList();<br/>
    {{showTab(2)}}}<br/>
    {{showTab(2)}}Example example = new Example({{table.pascalName}}PO.class);<br/>
    {{showTab(2)}}example.createCriteria().andIn("id", ids);<br/>
    {{showTab(2)}}return BeanConverter.copyList(mapper.selectByExample(example), {{table.pascalName}}BO.class);<br/>
    }<br/>
    </template>

     <br/>
    <template>
      @Override<br/>
      private Example getFilter({{table.pascalName}}SearchBO option) { <br/>
        {{showTab(2)}}Example example = new Example({{table.pascalName}}PO.class); <br/>
        {{showTab(2)}}Example.Criteria criteria = example.createCriteria(); <br/><br/>

        <template v-for="(column,index) in whereFields">         
           <template v-if="column.dataType == 'Integer'">
              {{showTab(2)}}if (Optional.ofNullable(option.get{{column.pascalName}}()).orElse(0) > 0) { <br/>
               {{showTab(2)}}{{showTab(2)}}criteria.andEqualTo("{{column.camelName}}", option.get{{column.pascalName}}()) <br/>
              {{showTab(2)}}} <br/>
            </template>

            <template v-if="column.dataType == 'Long'">
              {{showTab(2)}}if (Optional.ofNullable(option.get{{column.pascalName}}()).orElse(0L) > 0L) { <br/>
              {{showTab(2)}}{{showTab(2)}}criteria.andEqualTo("{{column.camelName}}", option.get{{column.pascalName}}()) <br/>
              {{showTab(2)}}} <br/>
            </template>

            <template v-if="column.dataType == 'String'">
                {{showTab(2)}}if (StringUtils.isNotBlank(option.get{{column.pascalName}})) { <br/>
                 {{showTab(2)}}{{showTab(2)}}criteria.andEqualTo("{{column.camelName}}", option.get{{column.pascalName}}()) <br/>
                {{showTab(2)}}}<br/>
            </template>
        </template>
        <br/>
        {{showTab(2)}}String orderStr = ""; <br/>
        {{showTab(2)}}String ascOrDesc = "desc"; <br/>
        {{showTab(2)}}if (option.getAsc()) { <br/>
            {{showTab(2)}}{{showTab(2)}}ascOrDesc = "asc"; <br/>
        {{showTab(2)}}} <br/>
        {{showTab(2)}}if (Optional.ofNullable(option.getOrderValue()).orElse(0) > 0) { <br/>      
          <template v-for="(column,index) in orderFields">    
            {{showTab(2)}}{{showTab(2)}}if (option.getOrderValue() == 1) { <br/>
                {{showTab(2)}}{{showTab(2)}}{{showTab(2)}}orderStr = " {{column.name}} " + ascOrDesc; <br/>
            {{showTab(2)}}{{showTab(2)}}} <br/>
          </template>    
        {{showTab(2)}}} else { <br/>
            {{showTab(2)}}{{showTab(2)}}orderStr = " id desc "; <br/>
        {{showTab(2)}}} <br/>

        {{showTab(2)}}example.setOrderByClause(orderStr); <br/>
        {{showTab(2)}}return example;<br/>
    }<br/>
    </template>
    </div>

    <div class="codeStye">
       
        <template>
        @Override<br/>
        public Integer updateByExampleSelective({{table.pascalName}}BO setterBO,
              <template v-for="(column,index) in whereFields">
                {{column.dataType}} {{column.camelName}}
                <template v-if="index !== (whereFields.length-1)">,</template>
              </template>) {<br/>
          
              <template v-for="column in whereFields">
                <template v-if="column.dataType == 'Long'">
                  {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0L)) { <br/>
                  {{showTab(2)}}{{showTab(2)}}return 0; <br/>
                  {{showTab(2)}}} <br/>
                </template>
                
                <template v-if="column.dataType == 'Integer'">
                  {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0)) { <br/>
                  {{showTab(2)}}{{showTab(2)}}return 0; <br/>
                  {{showTab(2)}}} <br/>
                </template>
                
                  <template v-if="column.dataType == 'String'">
                    {{showTab(2)}}if (StringUtils.isBlank({{column.camelName}})) { <br/>
                    {{showTab(2)}}{{showTab(2)}}return 0;<br/>
                    {{showTab(2)}}}<br/>
                </template>
              </template>
            {{showTab(2)}}Example updateWhere = new Example({{table.pascalName}}PO.class);<br/>
            {{showTab(2)}}updateWhere.createCriteria()<br/>
            <br/>
            <template v-for="(column,index) in whereFields">
              <div>
                {{showTab(2)}}{{showTab(2)}}.andEqualTo("{{column.camelName}}", {{column.camelName}})
                  <template v-if="index === (whereFields.length-1)">;</template>
              </div>
            </template>

            {{showTab(2)}}{{table.pascalName}}PO entity = BeanConverter.copy(setterBO, {{table.pascalName}}PO.class);
            <br/>
            {{showTab(2)}}return mapper.updateByExampleSelective(entity, updateWhere);<br/>
        }
        </template>

        <br/>
        <br/>
        <template>
        @Override<br/>
        public Integer updateByPrimaryKeySelective(
              <template v-for="(column,index) in setFields">
                {{column.dataType}} {{column.camelName}}
                <template v-if="index !== (clickedFields.length-1)">,</template>
              </template>) {<br/>
          
              <template v-for="column in setFields">
                <template v-if="column.dataType == 'Long'">
                  {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0L)) { <br/>
                  {{showTab(2)}}{{showTab(2)}}return 0; <br/>
                  {{showTab(2)}}} <br/>
                </template>
                
                <template v-if="column.dataType == 'Integer'">
                  {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0)) { <br/>
                  {{showTab(2)}}{{showTab(2)}}return 0; <br/>
                  {{showTab(2)}}} <br/>
                </template>
                
                  <template v-if="column.dataType == 'String'">
                    {{showTab(2)}}if (StringUtils.isBlank({{column.camelName}})) { <br/>
                    {{showTab(2)}}{{showTab(2)}}return 0;<br/>
                    {{showTab(2)}}}<br/>
                </template>
              </template>

            {{showTab(2)}}{{table.pascalName}}PO entity = new {{table.pascalName}}PO();<br/>
            
            <template v-for="(column,index) in setFields">
              <div>           
              {{showTab(2)}}entity.set{{column.pascalName}}({{column.camelName}})<br/>
                  <template v-if="index === (whereFields.length-1)">;</template>
              </div>
            </template>
        
            <br/>
            {{showTab(2)}}return mapper.updateByPrimaryKeySelective(entity);<br/>
        }
        </template>
   
        <br/>
        <br/>
        <template>
        @Override<br/>
        public {{table.primaryKeyType}} add({{table.pascalName}}BO entityBO) {<br/>
            {{showTab(2)}}if (entityBO == null) {<br/>
                {{showTab(2)}}{{showTab(2)}}return 0;<br/>
            {{showTab(2)}}}<br/>
            {{showTab(2)}}{{table.pascalName}}PO entityPO = BeanConverter.copy(entityBO, {{table.pascalName}}PO.class);<br/>
            {{showTab(2)}}mapper.insertSelective(entityPO);<br/>
            {{showTab(2)}}return entityPO.getId();<br/>
        }<br/>
        </template>

    </div>

  
    

   
  
  </div>


    <div id="publicService" v-if="show.showService">
      <div class="rpc">
        import com.jkys.phobos.annotation.Name;
        <br/>
        import com.jkys.phobos.annotation.Service;
        <br/>
        <br/>

        @Service("XXXXXXX.CustomerService:1.0.0")
        <br/>
        public interface {{table.pascalName}}Service {
        <br/>
        long add({{table.pascalName}}Model model);
        <br/>

        int update({{table.pascalName}}Model model) ;
        <br/>

        int delete(@Name("id") Long id) ;
        <br/>

        CustomerModel detail(@Name("id") {{table.primaryKeyType}} id);
        <br/>

        List {{_(table.pascalName + "Model")}} getList();
        <br/>
        }
      </div>
      -----------------------------------------------------
      <div class="service">
        <Input v-model="magic.magicReturn" placeholder="magicReturn" style="width: 100px" size="small"
               class="setterContent"/>
        <br/>
        public class {{table.pascalName}}ServiceImpl {
        <br/>
        @Autowired()
        <br/>
        private {{table.pascalName}}Mapper {{table.camelName}}Mapper;
        <br/>
        <br/>
        <div class="add">
          @Override
          <br/>
          public {{magicReturn('int')}} add({{table.pascalName}} entity) {
          <br/>
          return {{table.camelName}}Mapper.insertSingle(entity);
          <br/>
          }
        </div>

        <div class="update">
          @Override
          <br/>
          public {{magicReturn('int')}} update({{table.pascalName}} entity) {
          <br/>
          return {{table.camelName}}Mapper.updateSingle(entity);
          <br/>
          }
        </div>

        <div class="delete">
          @Override
          <br/>
          public {{magicReturn('int')}} delete({{table.pascalName}} entity) {
          <br/>
          return {{table.camelName}}Mapper.deleteSingle(entity.{{table.primaryKey}});
          <br/>
          }
        </div>

        <div class="list">
          @Override
          <br/>
          public {{magicReturn("List" + _(table.pascalName + "DTO"))}} get{{table.pascalName}}List() {
          <br/>
          List{{_(table.pascalName + "DTO")}} {{table.camelName}}DTOS = new ArrayList<>();
          <br/>

          List{{_(table.pascalName)}} {{table.camelName}}s = districtMapper.get{{table.pascalName}}List();
          <br/>

          {{table.camelName}}s.forEach(entity -> {
          <br/>

          });
          <br/>

          return {{table.camelName}}DTOS;
          <br/>

          }
        </div>

        <br/>
        }

      </div>
    </div>

    <div id="setter" v-if="show.showSetter">
      <Input v-model="setter.from" placeholder="from" style="width: 100px" size="small"/>
      <Input v-model="setter.to" placeholder="to" style="width: 100px" size="small"/>
      <br/>
      <div class="setterContent">
        <template v-for="column in table.columns">
          {{setter.to}}.set{{column.pascalName}}({{setter.from}}.get{{column.pascalName}}());
          <br/>
        </template>
        <br/>
        <template v-for="column in table.columns">
          {{setter.to}}.set{{column.pascalName}}({{column.camelName}});
          <br/>
        </template>
      </div>

    </div>

    <div id="enum" v-if="show.showEnum">
      <Input v-model="enumData.name" placeholder="枚举名称" style="width: 100px" size="small"/>

      <br/>

      public enum {{enumData.name}} {
      <br/>
      UN_KNOW(0, "未知");
      <br/>
      private int value;
      <br/>
      private String name;
      <br/>
      <br/>
      {{enumData.name}}(int value, String name) {
      <br/>
      this.value = value;
      <br/>
      this.name = name;
      <br/>
      }
      <br/>
      <br/>

      public String getName() {
      <br/>
      return name;
      <br/>
      }

      <br/>
      @Override
      <br/>
      public int getValue() {
      <br/>
      return value;
      <br/>
      }

      <br/>
      public static {{enumData.name}} ofType(Integer source) {
      <br/>
      if (source == null) return UN_KNOW;
      <br/>
      for ({{enumData.name}} item : values()) {
      <br/>
      if (source.equals(item.value)) return item;
      <br/>
      }

      <br/>
      return UN_KNOW;
      <br/>
      }
      <br/>
      }
    </div>

    <div id="showOther" v-if="show.showOther">
      <div class="showMockJson">
        {
        <template v-for="(column,index) in table.columns">
          <br/>
          "{{column.camelName}}" : null,      // {{ column.description }}
        </template>
        <br/>
        }
      </div>
      <div class="showMockJson">
        {
        <template v-for="(column,index) in table.columns">
          <br/>
          "{{column.camelName}}" : {{column.dataType == "String" ? '"'+column.description+'"' : "null"}},
        </template>
        <br/>
        }
      </div>
      <div class="showMockJsonTemplate">
        [
        <br/>
        {
        "description": "",
        "mockValue": "",
        "mockNum": "",
        "mockType": "Array",
        "required": true,
        "type": "Array",
        "name": "data",
        "children":[
        <template v-for="(column,index) in table.columns">
          <br/>
          {
          "description": "{{column.description}}",
          "mockValue": "",
          "mockNum": "",
          "mockType": "String",
          "required": true,
          "type": "String",
          "name": "{{column.camelName}}"
          }
          {{after(",",index,table.columns.length)}}
        </template>
        ]}
        <br/>
        ]
      </div>
      <div class="showMockJson">
        {
        <template v-for="(column,index) in table.columns">
          <br/>
          # {{column.description}}
          <br/>
          "{{column.name}}" : json_data["{{column.name}}"],
        </template>
        <br/>
        }
      </div>
    </div>

    <div v-if="show.showPythonSql">
          <div class="insertSingle">
            <div>

              'insert into {{table.name}} (
              <span v-for="(column,index) in table.columns">
                <template v-if="column.name !== table.primaryKey">
                    {{column.name}}
                    <span v-if="index !== (table.columns.length-1)">,</span>
                </template>
              </span>
              <span>
              ) values (
              <span v-for="(column,index) in table.columns">
                 <template v-if="column.name !== table.primaryKey">
                        <span>%s</span>
                        <span v-if="index !== (table.columns.length-1)">,</span>
                 </template>
            </span>
              )'
            </span>
            </br>
            (
            <span v-for="(column,index) in table.columns">
                 <template v-if="column.name !== table.primaryKey">
                        <span>data['{{column.name}}']</span>
                        <span v-if="index !== (table.columns.length-1)">,</span>
                 </template>
            </span>
            )
            </div>

          </div>

        <div class="updateSingle">
          update {{table.name}}
            <br/>
            set
            <template v-for="(column,index) in table.columns">
              <template v-if="column.name !== table.primaryKey ">
                {{column.name}} = %s,
              </template>
            </template>
            <br/>

            <br/>
        </div>

    </div>
  </div>
</template>


<script>
  import {dataConvert} from '../service.js'
  import ISelect from "iview/src/components/select/select";
  import IOption from "iview/src/components/select/option";
import { fail } from 'assert';

  export default {
    components: {
      IOption,
      ISelect
    },
    name: 'flash',
    data() {
      return {
        visible: false,
        msg: '',
        table: '',
        tables: '',        
        orderFields: [],
        clickedFields: [],
        whereFields: [],
        setFields: [],
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
      this.tables = dataConvert.getTable(this.$refs.create_table_script.innerText, this.filter.columns);
      this.table = this.tables[0];
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
      clearClickFileds() {
          this.whereFields = [];
          this.setFields = [];
          this.clickedFields = [];
          this.orderFields = [];
      },
      showTab(count) {
          let result = "";
          for(let i=0; i<count; i++){
            result += "\u00a0\u00a0\u00a0";
          }
          return result + '\u00a0';
      },
      pushField(field, pushType) {
          let contains = false;
          if(pushType == 1) {                  
            this.whereFields.forEach(t=> {
              if(t.camelName == field.camelName){
                contains = true;
                return; 
              }            
            });

            if(!contains) {
              this.whereFields.push(field);
            }
          } else if(pushType == 2) {                  
            this.setFields.forEach(function(t) {
              if(t.camelName == field.camelName){
                contains = true;
                return; 
              }          
            });
            if(!contains) {
              this.setFields.push(field);
            }
          } else if(pushType == 3) {                    
            this.orderFields.forEach(function(t) {
              if(t.camelName == field.camelName){
                contains = true;
                return; 
              }          
            });
            if(!contains) {
              this.orderFields.push(field);
            }
            return;
          }
          
          let containsAll = false;
          this.clickedFields.forEach(function(t) {
            if(t.camelName == field.camelName){
              containsAll = true;
              return; 
            }          
          });
          if(!containsAll) {
            this.clickedFields.push(field);
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

  #publicClass,#publicMapper,#publicService,#showOther{
    margin: 10px;
  }
  
  .codeStye {
    padding-left: 50px;
  }
</style>
