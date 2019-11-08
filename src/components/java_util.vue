<template>
  <div>
          <!-- 分页执行一个集合 -->
          Integer sourceMax = 6;
          double everyPageCount = 5D;
          Integer pageCount = (int)Math.ceil(sourceMax / everyPageCount);

          for (int i = 0; i &lt; pageCount; i++) {
              List<Integer> batch_insert = new ArrayList &lt;>();
              Integer currentPageMin = i * (int) everyPageCount;
              Integer currentPageMax = currentPageMin + (int) everyPageCount;
              Integer max = currentPageMax > sourceMax ? sourceMax : currentPageMax;

              for (int j = currentPageMin; j &lt; max; j++) {
                  batch_insert.add(j);
              }
              System.out.println(batch_insert);
              System.out.println("------------------");
          }
  </div>
  <div>
    <!--批量更新1-->
    <update id="update" parameterType="java.util.List">
      UPDATE dic_col_display
      SET column_code = CASE id
      <foreach collection="list" item="item" index="index" open="" separator="" close="">
        WHEN #{item.id} THEN #{item.column_code}
      </foreach>
      END,
      column_desc = CASE id
      <foreach collection="list" item="item" index="index" open="" separator="" close="">
        WHEN #{item.id} THEN #{item.column_desc}
      </foreach>
      END,
      modify_user_id = CASE id
      <foreach collection="list" item="item" index="index" open="" separator="" close="">
        WHEN #{item.id} THEN #{item.modify_user_id}
      </foreach>
      END,
      modify_user_name = CASE id
      <foreach collection="list" item="item" index="index" open="" separator="" close="">
        WHEN #{item.id} THEN #{item.modify_user_name}
      </foreach>
      END,
      modify_date = NOW()
      WHERE
      id in
      <foreach collection="list" item="item" index="index" open="(" separator="," close=")">
        #{item.id}
      </foreach>
    </update>

    <!--批量更新2-->
    insert into test_tbl (id,dr) values (1,'2'),(2,'3'),...(x,'y') on duplicate key update dr=values(dr);

    <!--批量更新3-->
    update test_tbl, (select a union all select b) tmp set test_tbl.dr=tmp.dr where test_tbl.id=tmp.id;

  </div>
</template>
