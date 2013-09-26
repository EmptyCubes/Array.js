Array.js
=======

IEnumerable for javascript Array

<pre>
   var source = [{ Id: 1, Name: 'Item 1' },
                 { Id: 2, Name: 'Item 2' },
                 { Id: 3, Name: 'Item 3' },
                 { Id: 4, Name: 'Item 4' },
                 { Id: 5, Name: 'Item 5' },
                 { Id: 6, Name: 'Item 6' },
                 { Id: 7, Name: 'Item 7' }];

   // Enjoy :)
   var query = 
      source.where('m=>m.Id > 3 &amp;&amp; m.Id &lt; 6')
            .orderByDesc('m=>m.Name');
            
</pre>
