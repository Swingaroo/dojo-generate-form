define(["doh/runner","gform/primitive/StringAttributeFactory","json-schema/lib/validate"], function(doh,StringAttributeFactory,validate){

	


    doh.register("gform-primitive-StringAttributeFactory", [
      function testValidate(){
				var saf = new StringAttributeFactory();
				var safSchema=saf.getSchema();
				var instance=dojo.fromJson(safSchema.example);
				var result = validate(instance,safSchema);
				if (!result.valid) {
					console.log(dojo.toJson(result,true));
				}
				doh.assertTrue(result.valid);		
      }
    ]);

});




