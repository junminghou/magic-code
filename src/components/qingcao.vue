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
              <div @click="pushField(column,1)" style="display: inline-block; cursor:pointer; margin-right: 10px; ">getOrWhere</div> 
              <div @click="pushField(column,2)" style="display: inline-block; cursor:pointer; ">setOrSelect</div>
              <div style=""> {{column.pascalName}} </div>              
            </div>
        </template>
    </div>

    <div id="create_table_script" ref="create_table_script">
create table follow_room_member
(
    id                      bigint unsigned auto_increment
        primary key,
    app_type                int unsigned     default 0                    not null comment 'app类型 0 轻抖APP 1 轻草提词器 2 轻草',
    user_id                 bigint unsigned  default 0                    not null comment '用户',
    room_id                 bigint unsigned  default 0                    not null comment '房间Id',
    join_fee                int(10)          default 0                    not null comment '加入费用',
    is_owner                tinyint(1)       default 0                    not null comment '是否房主',
    invite_user_id          bigint           default 0                    not null comment '邀请人',
    account_id              bigint unsigned  default 0                    not null comment '媒体账号表id',
    work_id                 bigint unsigned  default 0                    not null comment '作品id',
    join_times              int(11) unsigned default 1                    not null comment '该房间加入次数',
    pay_type                int(11) unsigned default 1                    not null comment '支付类型, 0: 免费, 1: 付费',
    join_status             int(11) unsigned default 0                    not null comment '加入的状态, 0: 加入中, 1: 加入成功, 2: 失效或取消',
    pre_join_time           int unsigned     default 0                    not null comment '预检查时的加入时间',
    join_time               int unsigned     default 0                    not null comment '成功的加入时间',
    failure_time            int(11) unsigned default 0                    not null comment '失效或取消时间',
    last_remind_follow_time int unsigned     default 0                    not null comment '最后被催关时间',
    is_follow_all           tinyint unsigned default 0                    not null comment '是否关注房内所有人',
    create_time             datetime(3)      default CURRENT_TIMESTAMP(3) not null,
    update_time             datetime(3)      default CURRENT_TIMESTAMP(3) not null on update CURRENT_TIMESTAMP(3),
    is_deleted              tinyint unsigned default 0                    not null
)
    comment '互关房用户参与表';

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

  <div id="publicMapper" v-if="show.showMapper">
     
    <template>
        @Override<br/>
        public List{{_(table.pascalName+"BO")}} findList(
          <template v-for="(column,index) in clickedFields">
            {{column.dataType}} {{column.camelName}}
            <template v-if="index !== (clickedFields.length-1)">,</template>
          </template>) {<br/>
          
          <template v-for="column in clickedFields">

            <template v-if="column.dataType == 'Long'">
              &emsp;&emsp;if ({{column.camelName}} == null || {{column.camelName}}.equals(0L)) { <br/>
              &emsp;&emsp;&emsp;&emsp;return Collections.emptyList(); <br/>
              &emsp;&emsp;} <br/>
            </template>
            
             <template v-if="column.dataType == 'Integer'">
              &emsp;&emsp;if ({{column.camelName}} == null || {{column.camelName}}.equals(0)) { <br/>
              &emsp;&emsp;&emsp;&emsp;return Collections.emptyList(); <br/>
              &emsp;&emsp;} <br/>
            </template>
            
              <template v-if="column.dataType == 'String'">
                &emsp;&emsp;if (StringUtils.isBlank({{column.camelName}})) { <br/>
                &emsp;&emsp;&emsp;&emsp;return Collections.emptyList();<br/>
                &emsp;&emsp;}<br/>
            </template>
          </template>
         <br/>

            &emsp;&emsp;Example example = new Example({{table.pascalName}}PO.class);<br/>
            &emsp;&emsp;example.createCriteria()<br/>
            <template v-for="(column,index) in whereFields">
              <div>
                &emsp;&emsp;&emsp;&emsp;.andEqualTo("{{column.camelName}}", {{column.camelName}})
                 <template v-if="index === (whereFields.length-1)">;</template>
              </div>
            </template>
            <br/>

            &emsp;&emsp;List{{_(table.pascalName+"PO")}} {{table.camelName}}List = mapper.selectByExample(example);<br/>
            &emsp;&emsp;if (CollectionUtils.isEmpty({{table.camelName}}List)) {<br/>
                &emsp;&emsp;&emsp;&emsp;return Collections.emptyList();<br/>
            &emsp;&emsp;}<br/>
            &emsp;&emsp;return BeanConverter.copyList({{table.camelName}}List, {{table.pascalName}}BO.class);<br/>
        }<br/>
    </template>
    
    <br/>
    <template>
    @Override<br/>
    public Integer updateBySelective(
          <template v-for="(column,index) in clickedFields">
            {{column.dataType}} {{column.camelName}}
            <template v-if="index !== (clickedFields.length-1)">,</template>
          </template>) {<br/>
       
          <template v-for="column in clickedFields">
            <template v-if="column.dataType == 'Long'">
              &emsp;&emsp;if ({{column.camelName}} == null || {{column.camelName}}.equals(0L)) { <br/>
              &emsp;&emsp;&emsp;&emsp;return 0; <br/>
              &emsp;&emsp;} <br/>
            </template>
            
             <template v-if="column.dataType == 'Integer'">
              &emsp;&emsp;if ({{column.camelName}} == null || {{column.camelName}}.equals(0)) { <br/>
              &emsp;&emsp;&emsp;&emsp;return 0; <br/>
              &emsp;&emsp;} <br/>
            </template>
            
              <template v-if="column.dataType == 'String'">
                &emsp;&emsp;if (StringUtils.isBlank({{column.camelName}})) { <br/>
                &emsp;&emsp;&emsp;&emsp;return 0;<br/>
                &emsp;&emsp;}<br/>
            </template>
          </template>

        &emsp;&emsp;{{table.pascalName}}PO entity = new {{table.pascalName}}PO();<br/>
        
         <template v-for="(column,index) in setFields">
          <div>           
           &emsp;&emsp;entity.set{{column.pascalName}}({{column.camelName}})<br/>
              <template v-if="index === (whereFields.length-1)">;</template>
          </div>
        </template>
      
        &emsp;&emsp;Example updateWhere = new Example({{table.pascalName}}PO.class);<br/>
        &emsp;&emsp;updateWhere.createCriteria()<br/>
        <template v-for="(column,index) in whereFields">
          <div>
            &emsp;&emsp;&emsp;&emsp;.andEqualTo("{{column.camelName}}", {{column.camelName}})
              <template v-if="index === (whereFields.length-1)">;</template>
          </div>
        </template>
        <br/>
        &emsp;&emsp;return mapper.updateByExampleSelective(entity, updateWhere);<br/>
    }
    </template>

    <br/>
    <template>
    @Override<br/>
    public {{table.pascalName}}BO findById({{table.primaryKeyType}} id) {<br/>
    &emsp;&emsp;if (id == null) {<br/>
    &emsp;&emsp;&emsp;return null;<br/>
    &emsp;&emsp;}<br/>
    &emsp;&emsp;return BeanConverter.copy(mapper.selectByPrimaryKey(id), {{table.pascalName}}BO.class);<br/>
    }<br/>
    </template>

     <br/>
    <template>
    @Override<br/>
    public List{{_(table.pascalName+"BO")}} findByIds(List{{_(table.primaryKeyType)}} ids) {<br/>
    &emsp;&emsp;if (CollectionUtils.isEmpty(ids)) {<br/>
    &emsp;&emsp;&emsp;return Collections.emptyList();<br/>
    &emsp;&emsp;}<br/>
    &emsp;&emsp;Example example = new Example({{table.pascalName}}PO.class);<br/>
    &emsp;&emsp;example.createCriteria().andIn("id", ids);<br/>
    &emsp;&emsp;return BeanConverter.copyList(mapper.selectByExample(example), {{table.pascalName}}BO.class);<br/>
    }<br/>
    </template>
    <br/>
    <template>
    @Override<br/>
    public {{table.primaryKeyType}} add({{table.pascalName}}BO entityBO) {<br/>
        &emsp;&emsp;if (entityBO == null) {<br/>
            &emsp;&emsp;&emsp;&emsp;return 0;<br/>
        &emsp;&emsp;}<br/>
        &emsp;&emsp;{{table.pascalName}}PO entityPO = BeanConverter.copy(entityBO, {{table.pascalName}}PO.class);<br/>
        &emsp;&emsp;mapper.insertSelective(entityPO);<br/>
        &emsp;&emsp;return entityPO.getId();<br/>
    }<br/>
    </template>
    
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
      },
      pushField(field, pushType) {
          if(pushType == 1) {        
            let contains = false;
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
            let contains = false;
            this.setFields.forEach(function(t) {
              if(t.camelName == field.camelName){
                contains = true;
                return; 
              }          
            });

            if(!contains) {
              this.setFields.push(field);
            }
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
      },addTab(count){
        if(count == 1){
          return '&emsp;';
        }
        if(count == 2){
          return '&emsp;&emsp;';
        }
        if(count == 3){
          return '&emsp;&emsp;&emsp;';
        }
        if(count == 4){
          return '&emsp;&emsp;&emsp;&emsp;';
        }
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
</style>
