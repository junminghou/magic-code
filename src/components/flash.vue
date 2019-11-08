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
        import org.apache.ibatis.annotations.*;
        <br/>
        import java.util.List;
        <br/>
        <br/>
        <div>public interface {{table.pascalName}}Mapper {</div>
        <div>
          <div class="querySql">
            <div>
            // mybatis 特殊字符需要转换, {{tempStr}}
            </div>
            String querySql = " where 1=1 "
            <div v-for="(column,index) in table.columns">
              <template v-if="column.dataType === 'String'">
                + " {{ _("if test = 'query."+column.camelName+" != null and query."+column.camelName+" != "+  quot + " ' ") }} and {{column.name}} =
                #{query.{{column.camelName}}} {{_("/if")}} "
              </template>
              <template v-if="column.dataType !== 'String'">
                + " {{ _("if test = 'query."+column.camelName+" != null' ") }} and {{column.name}} =
                #{query.{{column.camelName}}} {{_("/if")}} "
              </template>
            </div>
            ;
          </div>
          <br/>
          <div class="insertSingle">
            <div>
              @Options(useGeneratedKeys = true, keyProperty = "entity.{{table.primaryKeyCamel}}", keyColumn =
              "{{table.primaryKey}}")
              <br/>
              @Insert("{{_("script")}} insert into {{table.name}} (
              <span v-for="(column,index) in table.columns">
                <template v-if="column.name !== table.primaryKey">
                    {{column.name}}
                    <span v-if="index !== (table.columns.length-1)">,</span>
                </template>
              </span>
              <span>
              ) values ( " + <br/>
              "<span v-for="(column,index) in table.columns">
                 <template v-if="column.name !== table.primaryKey">
                        <span>#{entity.{{column.camelName}}}</span>
                        <span v-if="index !== (table.columns.length-1)">,</span>
                 </template>
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
          <!--TODO 批量插入待优化-->
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
          <!--TODO   待加入批量删除功能-->
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
            @Options(useGeneratedKeys = true, keyProperty = "entity.{{table.primaryKeyCamel}}", keyColumn =
            "{{table.primaryKey}}")
            <br/>
            @Insert("{{_("script")}} insert into {{table.name}} (
            <span v-for="(column,index) in table.columns">
              <template v-if="column.name !== table.primaryKey">
                  {{column.name}}
                  <span v-if="index !== (table.columns.length-1)">,</span>
              </template>
          </span>
            <span>
              ) values ( " + <br/>
              "<span v-for="(column,index) in table.columns">
                 <template v-if="column.name !== table.primaryKey">
                        <span>#{entity.{{column.camelName}}}</span>
                        <span v-if="index !== (table.columns.length-1)">,</span>
                 </template>
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
        <!--TODO 批量插入待优化-->
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
        <!--TODO   待加入批量删除功能-->
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
        <>

      </div>
      <div>}</div>
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

    <div v-if="show.showOther">
      <div class="showMockJson">
        {
        <template v-for="(column,index) in table.columns">
          <br/>
          "{{column.camelName}}" : null,
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
  import {dataConvert} from '../service'
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
</style>
