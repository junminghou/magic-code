<template>
  <div>
    <i-button @click="showAction('showClass')">class me!</i-button>
    <i-button @click="showAction('showMapper')">mapper me!</i-button>
    <i-button @click="showAction('showService')">service me!</i-button>
    <i-button @click="showAction('showSetter')">setter me!</i-button>


    <span>{{msg}}</span>

    <div id="create_table_script" ref="create_table_script">
      -- auto-generated definition
      CREATE TABLE st_partner_stock_month
      (
      id INT AUTO_INCREMENT
      COMMENT 'id'
      PRIMARY KEY,
      region VARCHAR(255) NULL
      COMMENT '大区',
      province VARCHAR(255) NULL
      COMMENT '省份',
      city VARCHAR(255) NULL
      COMMENT '城市',
      sale_person VARCHAR(255) NULL
      COMMENT '销售人员',
      partner VARCHAR(255) NULL
      COMMENT '经销商',
      sync_date DATE NULL
      COMMENT '同步时间',
      date_year VARCHAR(255) NULL
      COMMENT '年',
      date_month VARCHAR(255) NULL
      COMMENT '月',
      date_quarter VARCHAR(255) NULL
      COMMENT '季度',
      amount_in BIGINT(16) NULL
      COMMENT '金额（进货）',
      num_in INT NULL
      COMMENT '数量（进货）',
      amount_out BIGINT(16) NULL
      COMMENT '金额（出货）',
      num_out BIGINT(11) NULL
      COMMENT '数量（出货）',
      amount_gather BIGINT(16) NULL
      COMMENT '金额（收集）',
      num_gather BIGINT(11) NULL
      COMMENT '数量（收集）',
      gmt_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL
      COMMENT '创建时间',
      goods_name VARCHAR(255) NULL
      COMMENT '商品名称',
      category_1st VARCHAR(255) NULL
      COMMENT '商品分类一',
      category_2nd VARCHAR(255) NULL
      COMMENT '商品分类二',
      category_3rd VARCHAR(255) NULL
      COMMENT '商品分类三',
      is_important VARCHAR(255) NULL
      COMMENT '是否重点商品（瞬感、至新）',
      contract_status VARCHAR(255) NULL
      COMMENT '签约状态（签约、未签约）'
      )
      COMMENT '经销商库存'
      ENGINE = InnoDB;


    </div>

    <div id="publicClass" v-if="show.showClass">
      <div class="publicClass">
        <div>
          public class {{table.pascalName}} {
        </div>
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
      <div>public interface {{table.pascalName}}Mapper {</div>
      <div>
        <div class="querySql">
          String querySql = " where 1=1 " +
          <div v-for="(column,index) in table.columns">
            + " {{ _("if test = 'query."+column.camelName+" != null'") }} and {{column.name}} =
            #{query.{{column.camelName}}} {{_("/if")}} "
          </div>
          ;
        </div>
        <br/>
        <div class="insertSingle">
          <div>
            @Insert("{{_("script")}} insert into {{table.name}} (
            <span v-for="(column,index) in table.columns">
            <span v-if="index !== 0">,</span>
            <span>{{column.name}}</span>
          </span>
            <div>
              ) values (
              <span v-for="(column,index) in table.columns">
              <span v-if="index !== 0">,</span>
              <span>#{entity.{{column.camelName}}}</span>
            </span>
              )
            </div>
            {{_("/script")}}")
          </div>
          <div>
            int singleInsert(@Param("entity") {{table.pascalName}} entity);
          </div>
        </div>
        <br/>
        <div class="updateSingle">
          @Update("{{_('script')}} update {{table.name}} "
          <br/>
          + "{{_('set')}}"
          <template v-for="(column,index) in table.columns">
            <br/>
            + " {{ _("if test = 'entity."+column.camelName+" != null'") }} {{column.name}} =
            #{entity.{{column.camelName}}}, {{_("/if")}} "
          </template>
          <br/>
          + "{{_('/set')}}"
          <br/>
          + "where id = #{record.id} {{_('/script')}}")
          <br/>
          int update(@Param("entity") {{table.pascalName}} entity);
        </div>
        <br/>
        <div class="deleteSingle">
          @Delete("delete from {{table.name}} where id = #{id}")
          <br/>
          int deleteById(@Param("{{table.primaryKey}}") {{table.primaryKeyType}} {{table.primaryKey}});
        </div>
        <br>
        <div class="baseQuery">
          @Select("{{_('script')}} select * from {{table.name}} where id = #{id} {{ _('/script')}}")
          <br>
          {{table.pascalName}} get{{table.pascalName}}ById(@Param("{{table.primaryKey}}") {{table.primaryKeyType}}
          {{table.primaryKey}});
          <br>
          <br>
          @Select("{{_('script')}} select * from {{table.name}} where {{table.primaryKey}} in " +
          " {{_("foreach collection='ids' index='index' item='item' open='(' close=')' separator=',' ")}} " +
          " #{item} " +
          " {{_("/foreach")}} {{ _('/script')}}") ")
          <br>
          List<{{table.pascalName}}> get{{table.pascalName}}ByIds(@Param("ids") List<{{table.primaryKeyType}}> id);
        </div>
        <br>

      </div>
      <div>}</div>
    </div>

    <div id="publicService" v-if="show.showService">
      <Input v-model="magic.magicReturn" placeholder="magicReturn" style="width: 100px" size="small"
             class="setterContent"/>
      <br/>
      public class {{table.pascalName}}Service {
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
  </div>
</template>


<script>
  import {dataConvert} from '../service'

  export default {
    name: 'flash',
    data() {
      return {
        visible: false,
        msg: '',
        table: '',
        show: {
          showClass: false,
          showMapper: false,
          showService: false,
          showSetter: false
        },
        setter: {
          from: 'from',
          to: 'to',
        },
        magic: {
          magicReturn: ''
        }
      };
    },
    methods: {
      _(value) {
        return "<" + value + ">";
      },
      showAction: function (data) {
        this.table = dataConvert.getTable(this.$refs.create_table_script.innerText);

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
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  #create_table_script {
    display: none;
  }

  #setter {
    margin: 10px;
  }

  .setterContent {
    margin-top: 10px;
  }
</style>
