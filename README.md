# Dependent Optionset PCF (PowerApps Component Framework)
This control is new implementation of classic task with limiting of options available in one optionset depending on the value chosen in second optionset.

# Usage Instructions
1. Download latest version of solution from [releases](https://github.com/a33ik/DependentOptionset_PCF/releases) section
2. Import solution to your D365CE instance
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
4. Open form that you plan to use optionset at, add (if you haven't done that yet) both optionsets, select dependent optionset and click "Change Properties" and choose "Controls" tab in window that poped up.
5. Click "Add Control..." button, select "Dependent Optionset" in the list of available controls and click "Add".
