<template>
  <div>
    <div style="margin: 10px;">
      <i-select v-model="table" style="width:200px">
        <i-option v-for="item in tables" :value="item" :key="item">{{ item.description }}</i-option>
      </i-select>

      <i-button @click="showAction('showClass')">class me!</i-button>
      <i-button @click="showAction('showMapper')">manager me!</i-button>
      <i-button @click="showAction('showService')">service me!</i-button>
      <i-button @click="showAction('showSetter')">setter me!</i-button>
      <!-- <i-button @click="showAction('showEnum')">enum me!</i-button> -->
      <!-- <i-button @click="showAction('showOther')">mock me!</i-button> -->
      <!-- <i-button @click="showAction('showPythonSql')">python sql!</i-button> -->
      <i-button @click="clearClickFileds()">clearClickFileds</i-button>

      <span>{{msg}}</span>

      <div style="display: none;">
      </div>
    </div>
    <!-- <div id="columns" style=" margin: 10px;">
         <template v-for="column in table.columns" >          
            <div style=' width: 200px; display: inline-block; margin-top:10px;margin-bottom:5px;' >
              <div @click="pushField(column,1)" style="display: inline-block; cursor:pointer;">getOrWhere</div> 
              <div @click="pushField(column,2)" style="display: inline-block; cursor:pointer; ">setOrSelect</div>
              <div @click="pushField(column,3)" style="display: inline-block; cursor:pointer; ">orderBy</div>
              <div style=""> {{column.pascalName}} </div>              
            </div>
        </template>
    </div> -->

    <div id="create_class_script" ref="create_class_script" style="display: none;">
      public class Order {
        /**
          *
          */
        private Integer id;
        /**
          * 名称
          */
        private String name;
        /**
          * 订单库存
          */
        private Integer stock;
        /**
          * 创建时间
          */
        private String orderNo;
        /**
          * 更新时间
          */
        private Integer description;
    };
    public class User {
        /**
          *
          */
        private Integer id;
        /**
          * 名称
          */
        private @like String name  ;
        /**
          * 年龄
          */
        private Integer age;
        /**
          * 身高
          */
        private String heigh;
        /**
          * 描述
          */
        private Integer description;
    };
    public class ChargeResultVO {

private static final long serialVersionUID = -5483541541904867130L;

/**
 * 标题
 */
private String title;

/**
 * 副标题
 */
private String subTitle;

/**
 * 是否成功 1:成功；2：失败
 */
private Integer isSuccess;
}
    </div>

    <div id="create_table_script" ref="create_table_script">
      CREATE TABLE `order_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL comment '名称' @like,
  `stock` int(10) unsigned DEFAULT NULL comment '订单库存',
  `creator_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP comment '创建时间',
  `modify_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新时间',
  PRIMARY KEY (`id`)
) comment '订单库存'

    </div>

    <div style="display: inline-flex; padding:15px;">
      <!--  margin-right: 15px; width: 100%; min-width:250px; max-with: 375px; with: {{withCalc()}}px;-->
      <div id="columns" :style="withCalc()">
          <template v-for="column in table.columns" >          
              <div class="columnStyle">               
                <div style=""> {{column.pascalName}} </div>     
                <div @click="pushField(column,1)" style="display: inline-block; cursor:pointer;">Getter</div> 
                <div @click="pushField(column,2)" style="display: inline-block; cursor:pointer; ">Setter</div>
                <div @click="pushField(column,3)" style="display: inline-block; cursor:pointer; ">Orderby</div>         
              </div>
          </template>
      </div>

      <div id="publicClass" v-if="show.showClass" style="display: inline-flex;">
        <div class="publicClass">
          <div>
            @Data<br>
            @Builder<br>
            @AllArgsConstructor<br>
            @NoArgsConstructor<br>          
            @Table(name = "{{table.name}}")<br>
            public class {{table.pascalName}} {
          </div>
       
          <div v-for="(column,index) in table.columns">            
            <template v-if="column.isPK">
            {{showTab(2)}}@Id<br>
            {{showTab(2)}}@GeneratedValue(strategy = GenerationType.IDENTITY)<br>
            {{showTab(2)}}<span> private {{column.dataType}} {{column.camelName}};</span>
            </template>
            <template v-else>
            {{showTab(2)}} /** <br>
            {{showTab(2)}} &nbsp; * {{column.description}}<br>
            {{showTab(2)}} &nbsp; */<br>
            <!-- {{showTab(2)}} @ExcelProperty(value = "{{column.description}}", index = {{index}}) <br> -->
            {{showTab(2)}}<span> private {{column.dataType}} {{column.camelName}};</span>
            </template>
          </div>

          <div>
            }
          </div>
        </div>
        
        <div class="publicClassQuery2" style="margin-left: 15px;">
          @Data<br>
          @Builder<br>
          @AllArgsConstructor<br>
          @NoArgsConstructor<br>   
          public class {{table.pascalName}}Query {
          <br/>
          <template v-for="column in clickedFields">
        
            <template v-if="column.specialType.like">
              {{showTab(2)}} /** <br>
              {{showTab(2)}} &nbsp; * {{column.description}}<br>
              {{showTab(2)}} &nbsp; */<br>
              {{showTab(2)}} private {{column.dataType}} like{{column.pascalName}};
              <br>
            </template>
            <template v-else-if="column.specialType.time">
              {{showTab(2)}} /** <br>
              {{showTab(2)}} &nbsp; * {{column.description}}<br>
              {{showTab(2)}} &nbsp; */<br>
              {{showTab(2)}} private {{column.dataType}} {{column.camelName}}Begin;          
              <br>              
              {{showTab(2)}} /** <br>
              {{showTab(2)}} &nbsp; * {{column.description}}<br>
              {{showTab(2)}} &nbsp; */<br>
              {{showTab(2)}} private {{column.dataType}} {{column.camelName}}End;
              </br>
            </template>
            <template v-else>
            {{showTab(2)}} /** <br>
            {{showTab(2)}} &nbsp; * {{column.description}}<br>
            {{showTab(2)}} &nbsp; */<br>
            <!-- {{showTab(2)}} @ExcelProperty(value = "{{column.description}}", index = {{index}}) <br> -->
            {{showTab(2)}}<span> private {{column.dataType}} {{column.camelName}};</span>
             </br>
            </template>
          </template>
          }
        </div>

        <div class="publicClassQuery" style="margin-left: 15px;">
          @Data<br>
          @Builder<br>
          @AllArgsConstructor<br>
          @NoArgsConstructor<br>   
          public class {{table.pascalName}}Query extends {{table.pascalName}} {
          <br/>
          <template v-for="column in table.columns">
        
            <template v-if="column.specialType.like">
              {{showTab(2)}} /** <br>
              {{showTab(2)}} &nbsp; * {{column.description}}<br>
              {{showTab(2)}} &nbsp; */<br>
              {{showTab(2)}} private {{column.dataType}} like{{column.pascalName}};
              <br>
            </template>
            <template v-else-if="column.specialType.time">
              {{showTab(2)}} /** <br>
              {{showTab(2)}} &nbsp; * {{column.description}}<br>
              {{showTab(2)}} &nbsp; */<br>
              {{showTab(2)}} private {{column.dataType}} {{column.camelName}}Begin;          
              <br>              
              {{showTab(2)}} /** <br>
              {{showTab(2)}} &nbsp; * {{column.description}}<br>
              {{showTab(2)}} &nbsp; */<br>
              {{showTab(2)}} private {{column.dataType}} {{column.camelName}}End;
              </br>
            </template>
          </template>
          }
        </div>
      </div>

      <div id="publicMapper" v-if="show.showMapper" style=" padding-top: 0px; display: inline-flex;">
        <div >
    
        <template>
            @Override<br/>
            public List{{_(table.pascalName+"BO")}} findList(
              <template v-for="(column,index) in clickedFields">
               <template v-if="column.specialType.isIn">
               List{{_(column.dataType)}} {{column.camelName}}List
               </template>
               <template v-else>
                 {{column.dataType}} {{column.camelName}}
               </template>                              
                <template v-if="index !== (clickedFields.length-1)">,</template>
              </template>) {<br/>
              
                <template v-for="column in clickedFields">
                  <template v-if="column.specialType.isIn">
                    {{showTab(2)}}if (CollectionUtils.isEmpty({{column.camelName}}List)) { <br/>
                    {{showTab(2)}}{{showTab(2)}}return Collections.emptyList(); <br/>
                    {{showTab(2)}}} <br/>
                  </template>    
                  <template v-else-if="column.dataType == 'Long'">
                    {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0L)) { <br/>
                    {{showTab(2)}}{{showTab(2)}}return Collections.emptyList(); <br/>
                    {{showTab(2)}}} <br/>
                  </template>
                  <template v-else-if="column.dataType == 'Integer'">
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
                    <template v-if="column.specialType.isIn">
                    {{showTab(2)}}{{showTab(2)}}.andIn("{{column.camelName}}", {{column.camelName}}List)
                    </template>
                    <template v-else>
                    {{showTab(2)}}{{showTab(2)}}.andEqualTo("{{column.camelName}}", {{column.camelName}})
                    </template>
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
          private Example getFilter({{table.pascalName}}Query option) { <br/>
            {{showTab(2)}}Example example = new Example({{table.pascalName}}PO.class); <br/>
            {{showTab(2)}}Example.Criteria criteria = example.createCriteria(); <br/><br/>

            <template v-for="(column,index) in whereFields">  
              <template v-if="column.specialType.isIn">
                  {{showTab(2)}}if (CollectionUtils.isNotEmpty(option.get{{column.pascalName}}List())) { <br/>
                  {{showTab(2)}}{{showTab(2)}}criteria.andIn("{{column.camelName}}", option.get{{column.pascalName}}List()); <br/>
                  {{showTab(2)}}} <br/>
              </template>       
              <template v-else-if="column.specialType.time">
                  {{showTab(2)}}if (Optional.ofNullable(option.get{{column.pascalName}}Begin()).orElse(0) > 0) { <br/>
                  {{showTab(2)}}{{showTab(2)}}criteria.andGreaterThanOrEqualTo("{{column.camelName}}", option.get{{column.pascalName}}Begin()); <br/>
                  {{showTab(2)}}} <br/>

                  {{showTab(2)}}if (Optional.ofNullable(option.get{{column.pascalName}}End()).orElse(0) > 0) { <br/>
                  {{showTab(2)}}{{showTab(2)}}criteria.andLessThan("{{column.camelName}}", option.get{{column.pascalName}}End()); <br/>
                  {{showTab(2)}}} <br/>
              </template>
              <template v-else-if="column.specialType.like">
                  {{showTab(2)}}if (StringUtils.isNotBlank(option.getLike{{column.pascalName}}())) { <br/>
                  {{showTab(2)}}{{showTab(2)}}criteria.andLike("{{column.camelName}}", option.getLike{{column.pascalName}}()); <br/>
                  {{showTab(2)}}} <br/>
              </template>
                <template v-else-if="column.dataType == 'Integer'">
                  {{showTab(2)}}if (Optional.ofNullable(option.get{{column.pascalName}}()).orElse(0) > 0) { <br/>
                  {{showTab(2)}}{{showTab(2)}}criteria.andEqualTo("{{column.camelName}}", option.get{{column.pascalName}}()); <br/>
                  {{showTab(2)}}} <br/>
                </template>

                <template v-else-if="column.dataType == 'Long'">
                  {{showTab(2)}}if (Optional.ofNullable(option.get{{column.pascalName}}()).orElse(0L) > 0L) { <br/>
                  {{showTab(2)}}{{showTab(2)}}criteria.andEqualTo("{{column.camelName}}", option.get{{column.pascalName}}()); <br/>
                  {{showTab(2)}}} <br/>
                </template>

                <template v-else-if="column.dataType == 'String'">
                    {{showTab(2)}}if (StringUtils.isNotBlank(option.get{{column.pascalName}})) { <br/>
                    {{showTab(2)}}{{showTab(2)}}criteria.andEqualTo("{{column.camelName}}", option.get{{column.pascalName}}()); <br/>
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
                {{showTab(2)}}{{showTab(2)}}if (option.getOrderValue() == {{index+1}}) { <br/>
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
                      {{showTab(2)}}entity.set{{column.pascalName}}({{column.camelName}})
                      <template v-if="index === (whereFields.length-1)">;</template>
                      <br/>
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
                    {{showTab(2)}}{{showTab(2)}}return 0{{_L(table)}};<br/>
                {{showTab(2)}}}<br/>
                {{showTab(2)}}{{table.pascalName}}PO entityPO = BeanConverter.copy(entityBO, {{table.pascalName}}PO.class);<br/>
                {{showTab(2)}}try {<br/>
                {{showTab(2)}}{{showTab(2)}}int ret = mapper.insertSelective(entityPO);<br/>
                {{showTab(2)}}{{showTab(2)}}if (ret &lt;= 0) {<br/>
                {{showTab(2)}}{{showTab(2)}}{{showTab(2)}}return 0{{_L(table)}};<br/>
                {{showTab(2)}}{{showTab(2)}}}<br/>
                {{showTab(2)}}{{showTab(2)}}return entityPO.getId();<br/>                
                {{showTab(2)}}} catch (DuplicateKeyException exception) {<br/>
                {{showTab(2)}}{{showTab(2)}}log.warn("[{{table.description}}]插入时出现重复的Key, info: {}", entityBO);<br/>
                {{showTab(2)}}{{showTab(2)}}return 0{{_L(table)}};<br/>
                {{showTab(2)}}} catch (Exception exception) {<br/>
                {{showTab(2)}}{{showTab(2)}}log.error("[{{table.description}}]插入表时异常, msg: {}", exception.getMessage(), exception);<br/>
                {{showTab(2)}}{{showTab(2)}}return 0{{_L(table)}};<br/>
                {{showTab(2)}}}<br/>
            }<br/>
            </template>
            <br/>
            <template>
              @Override<br/>
              public {{table.pascalName+"BO"}} findOne(
                <template v-for="(column,index) in clickedFields">
                  {{column.dataType}} {{column.camelName}}
                  <template v-if="index !== (clickedFields.length-1)">,</template>
                </template>) {<br/>
                
                <template v-for="column in clickedFields">
                  <template v-if="column.dataType == 'Long'">
                    {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0L)) { <br/>
                    {{showTab(2)}}{{showTab(2)}}return null; <br/>
                    {{showTab(2)}}} <br/>
                  </template>
                  
                  <template v-if="column.dataType == 'Integer'">
                    {{showTab(2)}}if ({{column.camelName}} == null || {{column.camelName}}.equals(0)) { <br/>
                    {{showTab(2)}}{{showTab(2)}}return null; <br/>
                    {{showTab(2)}}} <br/>
                  </template>
                  
                    <template v-if="column.dataType == 'String'">
                      {{showTab(2)}}if (StringUtils.isBlank({{column.camelName}})) { <br/>
                      {{showTab(2)}}{{showTab(2)}}return null;<br/>
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
                  {{showTab(2)}}example.setOrderByClause("id desc limit 1");                  
                  <br/>
                
                  {{showTab(2)}}{{table.pascalName+"PO"}} {{table.camelName}} = mapper.selectOneByExample(example);<br/>                
                  {{showTab(2)}}return BeanConverter.copy({{table.camelName}}, {{table.pascalName}}BO.class);<br/>
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

      <div id="setter" v-if="show.showSetter" style="margin-left:50px;">
        <div>
          <Input v-model="setter.from" placeholder="from" style="width: 100px" size="small"/>
          <Input v-model="setter.to" placeholder="to" style="width: 100px" size="small"/>
        </div>
        <div style="display: inline-flex;">
          <div class="setterContent">
            <template v-for="column in table.columns">
              &nbsp;// {{column.description}}<br/>            
              &nbsp;{{setter.to}}.set{{column.pascalName}}({{setter.from}}.get{{column.pascalName}}());<br/>
            </template>
          </div>

          <div class="setterContent" style="margin-left: 10px;">
              <template v-for="column in table.columns">
               &nbsp;// {{column.description}}<br/>
               &nbsp;{{setter.to}}.set{{column.pascalName}}({{column.camelName}});
              <br/>
            </template>
          </div>

          <div class="setterContent" style="margin-left: 10px;">
            <template v-for="column in table.columns">
            // {{column.description}}<br/>
            .{{column.camelName}}({{setter.from}}.get{{column.pascalName}}())<br/>
            </template>
          </div>

          <div class="setterContent" style="margin-left: 10px; display: none;">
            <template v-for="column in table.columns">
              &nbsp;// {{column.description}}<br/>
              <template v-if="column.dataType == 'BigDecimal'">
              &nbsp;{{setter.to}}.set{{column.pascalName}}(defautValue({{setter.to}}.get{{column.pascalName}}()).add({{setter.from}}.get{{column.pascalName}}()));<br/>
              </template>
              <template v-else-if="column.dataType == 'String' || column.dataType == 'Date'">
              &nbsp;{{setter.to}}.set{{column.pascalName}}({{setter.from}}.get{{column.pascalName}}());<br/>
              </template>
              <template v-else>
              &nbsp;{{setter.to}}.set{{column.pascalName}}(defautValue({{setter.to}}.get{{column.pascalName}}()) + {{setter.from}}.get{{column.pascalName}}());<br/>
              </template>
            </template>
          </div>
        </div>
      </div>

      <div id="enum" v-if="show.showEnum">
        <Input v-model="enumData.name" placeholder="枚举名称" style="width: 100px" size="small"/>

        <br/>

        public enum {{enumData.name}} {
        <br/>
        {{showTab(2)}}UN_KNOW(0, "未知");
        <br/>
        {{showTab(2)}}private int value;
        <br/>
        {{showTab(2)}}private String name;
        <br/>
        <br/>
        {{showTab(2)}}{{enumData.name}}(int value, String name) {
        <br/>
        {{showTab(2)}}{{showTab(2)}}this.value = value;
        <br/>
        {{showTab(2)}}{{showTab(2)}}this.name = name;
        <br/>
        {{showTab(2)}}}
        <br/>
        <br/>

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
    name: 'flash',
    data() {
      return {
        visible: false,
        msg: '',
        table: '',
        tables: [],        
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
      let dbTables = dataConvert.getTable(this.$refs.create_table_script.innerText, this.filter.columns);    
      let javaClasses = dataConvert.getTableByJavaClass(this.$refs.create_class_script.innerText, this.filter.columns);   
      if(dbTables.length>0){
        this.table = dbTables[0];
      } else {
        this.table = javaClasses[0];
      }
      dbTables.forEach(t=>{
        if(t.columns.length != 0){
          this.tables.push(t);
        }
      });
      javaClasses.forEach(t=>{
        if(t.columns.length != 0){
          this.tables.push(t);
        }
      });
    },
    methods: {
      _(value) {
        return "<" + value + ">";
      },
      withCalc(){
        // alert('1');
        let withValue = 375;
   
        if(this.table !== ''){
          withValue = Math.ceil(this.table.columns.length / 17) * 125;           
        }
        return "margin-right:15px;display: inline-flex; max-height: 870px;flex-direction: column;flex-wrap: wrap; align-content: flex-start; width: " + withValue + "px";
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
      _L(table) {
        if(table.primaryKeyType == 'Long') {
          return 'L';
        }
        return '';
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

  .columnStyle {
    margin-top:5px;
    margin-bottom:10px;
    margin-left: 5px;
    width: 125px;
  }
</style>
