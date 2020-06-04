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
      -- auto-generated definition
      CREATE TABLE drug_gnu
      (
      id                       BIGINT                             NOT NULL
      PRIMARY KEY,
      create_time              DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
      modify_time              DATETIME DEFAULT CURRENT_TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      name                     VARCHAR(180)                       NULL
      COMMENT '药品通用名称',
      name_en                  VARCHAR(255)                       NULL,
      is_base                  INT(255)                           NULL
      COMMENT '是否基药',
      pinyin                   VARCHAR(255)                       NULL
      COMMENT '拼音',
      initial                  VARCHAR(255)                       NULL
      COMMENT '拼音首字母',
      contraindication         TEXT                               NULL
      COMMENT '用药禁忌',
      symptom                  VARCHAR(255) DEFAULT ''            NOT NULL
      COMMENT '患者主诉',
      illness                  VARCHAR(255) DEFAULT ''            NOT NULL
      COMMENT '疾病诊断',
      indication               VARCHAR(255)                       NULL
      COMMENT '适用症',
      untoward_effect          VARCHAR(2048)                      NULL
      COMMENT '不良反应',
      ingredient               VARCHAR(255)                       NULL
      COMMENT '药品成分',
      attention                TEXT                               NULL
      COMMENT '注意事项',
      classify                 VARCHAR(255)                       NULL
      COMMENT '药物分类类别',
      gender                   VARCHAR(255)                       NULL
      COMMENT '适合性别',
      is_allergy               INT(255)                           NULL
      COMMENT '是否过敏判断,1:是,0:不是',
      drug_type                VARCHAR(255)                       NULL
      COMMENT '药品类型',
      available_crowd          VARCHAR(255)                       NULL
      COMMENT '可用人群',
      instructions_crowd       VARCHAR(255)                       NULL
      COMMENT '说明书服用人群',
      is_rx                    INT(255)                           NULL
      COMMENT '1:处方药,0:otc',
      reagent_type             VARCHAR(255)                       NULL
      COMMENT '剂型',
      is_antibiotics           INT(255)                           NULL
      COMMENT '是否抗生素,1:是,0:不是',
      medical_insurance_type   VARCHAR(255)                       NULL
      COMMENT '医保类型',
      drug_usage               VARCHAR(255)                       NULL
      COMMENT '用法',
      standard_manufacturers   VARCHAR(255)                       NULL
      COMMENT '标准厂家',
      is_issue                 INT(255) DEFAULT '1'               NOT NULL
      COMMENT '是否可开具,1:可以,0:不行',
      drug_storage             VARCHAR(255) DEFAULT ''            NULL
      COMMENT '贮藏',
      description              VARCHAR(255) DEFAULT ''            NULL
      COMMENT '性状',
      drug_interactions        VARCHAR(1000) DEFAULT ''           NULL
      COMMENT '药物相互作用',
      pharmacological_toxicity VARCHAR(1000) DEFAULT ''           NULL
      COMMENT '药理毒性',
      usage_dosage_description VARCHAR(1000) DEFAULT ''           NULL
      COMMENT '用法用量',
      )  COMMENT 'Gnu'
      ENGINE = InnoDB;


      CREATE TABLE drug_spu
      (
      id                   BIGINT                             NOT NULL
      PRIMARY KEY,
      create_time          DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
      modify_time          DATETIME DEFAULT CURRENT_TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      drug_id              BIGINT                             NOT NULL
      COMMENT '药品id',
      name                 VARCHAR(180)                       NULL
      COMMENT '药品名',
      spec                 VARCHAR(180)                       NULL
      COMMENT '规格',
      initial              VARCHAR(255)                       NULL
      COMMENT '拼音首字母',
      spec_key             VARCHAR(255)                       NULL,
      per_num              VARCHAR(11)                        NULL
      COMMENT '用量',
      per_unit             VARCHAR(255)                       NULL
      COMMENT '每次用量单位',
      usage_frequency_code INT(255)                           NULL
      COMMENT '用药频次',
      usage_frequency_name VARCHAR(255)                       NULL
      COMMENT '用药频次',
      unit                 VARCHAR(255)                       NULL
      COMMENT '单品单位',
      taking_day           INT(255)                           NULL
      COMMENT '服药天数',
      age_start            INT(255)                           NULL
      COMMENT '年龄开始',
      age_start_unit       VARCHAR(255)                       NULL
      COMMENT '年龄开始单位',
      age_end              INT(255)                           NULL
      COMMENT '年龄结束',
      age_end_unit         VARCHAR(255)                       NULL
      COMMENT '年龄结束单位',
      taking_amount        INT(20)                            NULL,
      CONSTRAINT uk_name_spec
      UNIQUE (name, spec)
      )
      COMMENT 'Spu'
      ENGINE = InnoDB;

      CREATE TABLE drug_sku
      (
      id              BIGINT                             NOT NULL
      PRIMARY KEY,
      create_time     DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
      modify_time     DATETIME DEFAULT CURRENT_TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
      barcode         VARCHAR(180)                       NULL
      COMMENT '条形码',
      standard_code   VARCHAR(255)                       NULL
      COMMENT '本位码',
      production_area VARCHAR(255)                       NULL
      COMMENT '生产地区',
      enterprise      VARCHAR(180)                       NULL
      COMMENT '生产企业',
      brand           VARCHAR(255)                       NULL
      COMMENT '品牌',
      product_name    VARCHAR(255)                       NULL
      COMMENT '商品名',
      alias           VARCHAR(255)                       NULL
      COMMENT '曾用名',
      approval_number VARCHAR(180)                       NULL
      COMMENT '批准文号',
      approval_time   VARCHAR(255)                       NULL
      COMMENT '批准时间',
      product_id      BIGINT                             NOT NULL
      COMMENT '所对应产品表id
      ',
      drug_id         BIGINT                             NOT NULL,
      thumbnail       VARCHAR(500) DEFAULT ''            NULL
      COMMENT '缩略图',
      shelf_life      VARCHAR(100) DEFAULT ''            NULL
      COMMENT '保质期',
      CONSTRAINT barcode
      UNIQUE (barcode),
      CONSTRAINT approval_number
      UNIQUE (enterprise, approval_number, product_id)
      )
      COMMENT 'SKU'
      ENGINE = InnoDB;

      CREATE TABLE temp
      (
      id            BIGINT AUTO_INCREMENT
      PRIMARY KEY,
      drug_storage             VARCHAR(255) DEFAULT ''            NULL
      COMMENT '贮藏',
      description              VARCHAR(255) DEFAULT ''            NULL
      COMMENT '性状',
      drug_interactions              VARCHAR(1000) DEFAULT ''           NULL
      COMMENT '药物相互作用',
      pharmacological_toxicity VARCHAR(1000) DEFAULT ''           NULL
      COMMENT '药理毒性',
      usage_dosage_description VARCHAR(1000) DEFAULT ''           NULL
      COMMENT '用法用量',
      thumbnail       VARCHAR(500) DEFAULT ''            NULL
      COMMENT '缩略图',
      shelf_life      VARCHAR(100) DEFAULT ''            NULL
      COMMENT '保质期',
      reagent_type             VARCHAR(255)                       NULL
      COMMENT '剂型',
      standard_manufacturers   VARCHAR(255)                       NULL
      COMMENT '标准厂家',
      approval_number VARCHAR(180)                       NULL
      COMMENT '批准文号',
      spec                 VARCHAR(180)                       NULL
      COMMENT '规格',
      barcode         VARCHAR(180)                       NULL
      COMMENT '条形码',
      product_id      BIGINT                             NOT NULL
      COMMENT '所对应产品表id'
      )
      COMMENT '用户查看协议表'
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
            // 警告: 有外键关联的表ID记得不要更新，否则会出问题
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
