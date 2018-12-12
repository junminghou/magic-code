<template>
  <div>
    <i-button @click="showAction('showClass')">class me!</i-button>
    <i-button @click="showAction('showMapper')">mapper me!</i-button>
    <i-button @click="showAction('showService')">service me!</i-button>
    <i-button @click="showAction('showSetter')">setter me!</i-button>


    <span>{{msg}}</span>

    <div id="create_table_script" ref="create_table_script">

      CREATE TABLE company
      (
      company_id        BIGINT AUTO_INCREMENT
      COMMENT '企业ID'
      PRIMARY KEY,
      name              VARCHAR(500)                        NULL
      COMMENT '企业名称',
      status            INT                                 NULL
      COMMENT '认证状态',
      company_type      INT                                 NULL
      COMMENT '企业类型',
      user_category1_id INT                                 NULL
      COMMENT '用户大类ID',
      user_category2_id INT                                 NULL
      COMMENT '用户小类ID',
      logo              VARCHAR(500)                        NULL
      COMMENT 'logo',
      district_code     INT                                 NULL
      COMMENT '区域编码',
      province_name     VARCHAR(50)                         NULL
      COMMENT '省份名称',
      city_name         VARCHAR(50)                         NULL
      COMMENT '城市名称',
      address           VARCHAR(1000)                       NULL
      COMMENT '企业地址',
      register_number   VARCHAR(50)                         NULL
      COMMENT '营业执照注册号',
      taxpayer_id       VARCHAR(50)                         NULL
      COMMENT '纳税人识别号',
      company_tel       VARCHAR(15)                         NULL
      COMMENT '公司电话',
      main_business     VARCHAR(50)                         NULL
      COMMENT '主营业务',
      company_desc      VARCHAR(1000)                       NULL
      COMMENT '公司描述',
      bank_name         VARCHAR(50)                         NULL
      COMMENT '开户行',
      bank_numer        VARCHAR(50)                         NULL
      COMMENT '开户行号',
      invoice_address   VARCHAR(1000)                       NULL
      COMMENT '发票地址',
      invoice_user_name VARCHAR(50)                         NULL
      COMMENT '发票邮寄人',
      invoice_tel       VARCHAR(18)                         NULL
      COMMENT '发票邮寄人电话',
      company_user_name VARCHAR(50)                         NULL
      COMMENT '企业联系人',
      company_user_tel  VARCHAR(18)                         NULL
      COMMENT '企业联系人电话',
      creator_user_id   BIGINT                              NULL
      COMMENT '创建者ID',
      gmt_create        TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
      gmt_modify        TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL
      )
      COMMENT '企业信息'
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
      import org.apache.ibatis.annotations.*;
      <br/>
      import java.util.List;
      <br/>
      <br/>
      <div>public interface {{table.pascalName}}Mapper {</div>
      <div>
        <div class="querySql">
          String querySql = " where 1=1 "
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
            <span>
              ) values ( " + <br/>
              "<span v-for="(column,index) in table.columns">
              <span v-if="index !== 0">,</span>
              <span>#{entity.{{column.camelName}}}</span>
            </span>
              )
            </span>
            {{_("/script")}}")
          </div>
          <div>
            int singleInsert(@Param("entity") {{table.pascalName}} entity);
          </div>
        </div>
        <br/>
        <div class="batchInsert">
          @Insert("{{_('script')}} insert into {{table.name}} (
          <template v-for="(column,index) in table.columns">
            <template v-if="index !==0">
              ,
            </template>
            {{column.name}}
          </template>
          ) values " + <br/>
        "{{_("foreach collection='list' item='item' index='index' separator=',' ")}} " + <br/>
          "  (
          <template v-for="(column,index) in table.columns">
            <template v-if="index !==0">
              ,
            </template>
            #{item.{{column.camelName}}}
          </template>
          )" + <br/>
          "{{_("/foreach") + _("/script")}}")
          <br/>
          int batchInsert(@Param("list") List{{_(table.pascalName)}} {{table.camelName}});
        </div>

        <br/>
        <div class="updateSingle">
          @Update("{{_('script')}} update {{table.name}} "
          <br/>
          + "{{_('set')}}"
          <template v-for="(column,index) in table.columns">
            <template v-if="column.name !== table.primaryKey ">
              <br/>
            + " {{ _("if test = 'entity."+column.camelName+" != null'") }} {{column.name}} =
            #{entity.{{column.camelName}}}, {{_("/if")}} "
            </template>
          </template>
          <br/>
          + "{{_('/set')}}"
          <br/>
          + "where {{table.primaryKey}} = #{record.{{table.primaryKeyCamel}}} {{_('/script')}}")
          <br/>
          int update(@Param("entity") {{table.pascalName}} entity);
        </div>
        <br/>
        <div class="deleteSingle">
          @Delete("delete from {{table.name}} where {{table.primaryKey}} = #{id}")
          <br/>
          int deleteById(@Param("id") {{table.primaryKeyType}} {{table.primaryKeyCamel}});
        </div>
        <br>
        <div class="baseQuery">
          @Select("{{_('script')}} select * from {{table.name}} where {{table.primaryKey}} = #{id} {{ _('/script')}}")
          <br>
          {{table.pascalName}} get{{table.pascalName}}ById(@Param("id") {{table.primaryKeyType}}
          {{table.primaryKeyCamel}});
          <br>
          <br>
          @Select("{{_('script')}} select * from {{table.name}} where {{table.primaryKey}} in " +
          " {{_("foreach collection='ids' index='index' item='item' open='(' close=')' separator=',' ")}} " +
          " #{item} " +
          " {{_("/foreach")}} {{ _('/script')}}")
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
