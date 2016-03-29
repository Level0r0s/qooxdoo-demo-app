qx.Class.define("demoapp.issue196.Application", {
  extend: qx.application.Standalone,

  members: {
    main: function() {
      this.base(arguments);

      if (qx.core.Environment.get("qx.debug")) {
        qx.log.appender.Native;
        qx.log.appender.Console;
      }

      qx.Class.define("Dummy", {
        extend: qx.core.Object,
        properties: {
          name: {
            check: "String",
            event: "changeName"
          },
          index: {
            check: Number
          }
        }
      });

      qx.Class.define("Item", {
        extend: qx.ui.form.ListItem,

        properties: {
          index: {
            init: ''
          }
        },

        members: {
          _applyModel: function(model) {
            if (model) {
              if (model.getUserData("filtered") === true) {
                console.error("%d: Filtered model item applied", this.getIndex());
              } else {
                console.log("%d: model applied %s", this.getIndex(), model.getName());
              }
            } else {
              console.log("%d: model set to null", this.getIndex());
            }
          }
        }
      })

      var doc = this.getRoot();

      var list = new qx.ui.form.List();

      var delegate = {
        createItem: function() {
          return new Item();
        },
        bindItem: function(controller, item, index) {
          item.setIndex(index);
          controller.bindDefaultProperties(item, index);
        },
        filter: function(dummy) {
          console.trace("filtering");
          return !dummy.getUserData("filtered");
        }
      };
      // list.setLabelPath("name");
      // list.setDelegate(delegate);

      var controller = new qx.data.controller.List(null, list, "name");
      controller.setDelegate(delegate);

      var model = new qx.data.Array();
      for (var i = 0; i < 5; i++) {
        model.push(new Dummy().set({
          name: "Dummy " + i
        }));
      }
      model.getItem(1).setUserData("filtered", true);
      model.getItem(1).setName("filtered item");
      controller.setModel(model);

      doc.add(list, {
        edge: 0
      });

      var button = new qx.ui.form.Button("Shift");
      doc.add(button, {
        bottom: 0,
        left: 0
      });
      button.addListener("execute", function() {
        model.shift();
      }, this);

    }
  }
});
