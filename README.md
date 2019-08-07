# Dependent Optionset PCF (PowerApps Component Framework)
This control is new implementation of classic task with limiting of options available in one optionset depending on the value chosen in second optionset.

# Usage Instructions
1. Download the latest version of solution from [releases](https://github.com/a33ik/DependentOptionset_PCF/releases) section
2. Import the solution to your D365CE instance
3. Prepare dependency between optionsets that has following format:
```
[
  { 
    "parentOption": 108730000, 
    "childOptions": [108730000, 108730001, 108730002] 
  }, 
  { 
    "parentOption": 108730001, 
    "childOptions": [108730003, 108730004] 
  }, 
  { 
    "parentOption": 108730002, 
    "childOptions": [108730005, 108730006] 
  }
]
```
4. Create a webresource and store this configuration inside, copy the webresource name somewhere (in my case it was 'ab_/ParentChildDependency.js').
5. Open the form that you plan to use the optionset at, add (if you haven't done that yet) both optionsets, select the dependent optionset and click "Change Properties" and choose the "Controls" tab in window that popped up:
![Add Custom Control](https://github.com/a33ik/DependentOptionset_PCF/blob/master/ReadMe/DO_AddControl.png?raw=true, "Add Custom Control")
6. Click the "Add Control..." button, select "Dependent Optionset" in the list of available controls and click "Add".
7. In "Control" section, choose for which types of client this control will be used.
8. Property "Dependent Optionset" will be selected by default, so choose parent optionset field in "Parent Optionset" property.
9. Insert the webresource name you created in step 4 into the "Configuration" property.
![Optionset Properties](https://github.com/a33ik/DependentOptionset_PCF/blob/master/ReadMe/DO_Configuration.png?raw=true, "Optionset Properties")
10. Save settings of optionset configuration, save and publish the entity form.
