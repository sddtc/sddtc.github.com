---
title: 分布式缓存在MapReduce上的使用
layout: post
categories: sddtc tech
guid: urn:uuid:fb59ef6c-a9e2-4bf6-a7a0-d51d80f4250b
tags:
  - java
---

在写mapreduce时，简单的统计可以用一个文件搞定，只是如果需要关联其它文件的列  
诸如文件A中有id字段，对文件A输出需要得到id对应的name字段，在其它小文件中，我们就需要用到这个非常实用的分布式缓存接口  

生产环境hadoop版本在2.5以上，也不打算使用旧mapreduce接口  
那么关于DistributedCache一律不再使用  
当然，新版的分布式缓存也只是将相应的方法放在了Job里  

当我们想要关联字段以及含义的时候，会选择在map阶段、或者reduce阶段  
我选择在map的时候进行关联，本质上来讲，会将一个个小文件读到每一个datanode节点的内存里  
以复制的姿态作为分布式的一种冗余实现方式  
具体方法如下:  

1. Job装配阶段，将小文件的hdfs相对路径地址写入  

```java

Configuration configuration = new Configuration();
Job job = Job.getInstance(configuration, "new-job-task");

try {
    job.addCacheFile(new Path(MG_USER_SMALL_TABLE).toUri());
    job.addCacheFile(new Path(MG_BLOGGER_SMALL_TABLE).toUri());
} catch (Exception e) {
    e.printStackTrace();
}

```

2. map阶段，将小文件读入内存中  

```java

private FileSystem hdfs = null;
private Map<String, String> publisherIdWithName = new HashMap<String, String>();

@Override
protected void setup(Context context) throws IOException, InterruptedException {
    System.setProperty("file.encoding", "UTF-8");
    try {
        this.hdfs = FileSystem.get(context.getConfiguration());
        URI[] uries = context.getCacheFiles();
        for (URI uri : uries) {
            List<String> lines = readLinesFromJobFS(new Path(uri));
            for (String line : lines) {
                String[] values = line.split(EditorCountResult.DELIMITER);
                publisherIdWithName.put(values[0], values[2]);//id, userName
            }
        }
    } catch (Exception ex) {
        ex.printStackTrace();
    }
}

private List<String> readLinesFromJobFS(Path p) throws Exception {
    List<String> ls = new ArrayList<String>();
    BufferedReader br = new BufferedReader(new InputStreamReader(this.hdfs.open(p)));
    String line = br.readLine();
    while (line != null) {
        line = br.readLine();
        if (line != null)
            ls.add(line);
    }
    return ls;
}
 
```


