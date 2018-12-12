<template>
  <div>
    <i-button @click="showAction('showClass')">class me!</i-button>
    <i-button @click="showAction('showMapper')">mapper me!</i-button>
    <i-button @click="showAction('showService')">service me!</i-button>
    <i-button @click="showAction('showSetter')">setter me!</i-button>
    <i-button @click="showAction('showEnum')">enum me!</i-button>


    <span>{{msg}}</span>

    <div id="create_table_script" ref="create_table_script">

      CREATE TABLE company_image
      (
      company_id BIGINT NOT NULL
      COMMENT '企业ID'
      PRIMARY KEY,
      title VARCHAR(50) NULL
      COMMENT '前后端约束的Key',
      url VARCHAR(200) NULL
      COMMENT 'Url',
      sort INT NULL
      COMMENT '排序'
      )
      COMMENT '企业相关照片'
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
          " (
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
          + "where {{table.primaryKey}} = #{entity.{{table.primaryKeyCamel}}} {{_('/script')}}")
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


    <div id="enum" v-if="show.showEnum">
      <Input v-model="enumData.name" placeholder="枚举名称" style="width: 100px" size="small"/>

      <br/>

      public enum {{enumData.name}} {
      <br/>
      UNKONW(0, "未知");
      <br/>

      private String name;
      <br/>

      private Integer type;
      <br/>

      {{enumData.name}}(Integer type, String name) {
      <br/>

      this.type = type;
      <br/>

      this.name = name;
      <br/>

      }

      <br/>

      public String getName() {
      <br/>

      return name;
      <br/>

      }
      <br/>

      public void setName(String name) {
      <br/>

      this.name = name;
      <br/>

      }
      <br/>

      public Integer getType() {
      <br/>
      return type;
      <br/>
      }

      <br/>
      public void setType(Integer type) {
      <br/>
      this.type = type;
      <br/>
      }

      <br/>
      public static {{enumData.name}} ofType(Integer source) {
      <br/>
      if (source == null) return UNKONW;

      <br/>
      for ({{enumData.name}} item : values()) {
      <br/>
      if (item.type.equals(source)) return item;
      <br/>
      }
      <br/>

      <br/>
      return UNKONW;
      <br/>
      }
      <br/>
      }
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
          showSetter: false,
          showEnum: false,
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
