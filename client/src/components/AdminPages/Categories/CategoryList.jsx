import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Accordion, AccordionSummary, AccordionDetails, Typography, CssBaseline, Box, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "@fontsource/montserrat";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

const buildCategoryTree = (categories) => {
  const categoryMap = new Map();
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, subcategories: [] });
  });

  const tree = [];
  categories.forEach((category) => {
    if (category.parentId === null) {
      tree.push(categoryMap.get(category.id));
    } else {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.subcategories.push(categoryMap.get(category.id));
      }
    }
  });

  return tree;
};

const CategoryAccordion = ({ category }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpand}
      disableGutters
      sx={{
        boxShadow: "none",
        width: "fit-content",
        minWidth: "250px",
        maxWidth: "500px",
        "&:before": { display: "none" },
        "& .MuiAccordionSummary-root": { borderTop: "none", padding: "0" },
      }}
    >
      <AccordionSummary
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>{category.name}</Typography>
        {category.subcategories.length > 0 && (
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        )}
      </AccordionSummary>
      {category.subcategories.length > 0 && (
        <AccordionDetails sx={{ padding: "0 16px" }}>
          <div style={{ paddingLeft: "50px" }}>
            {category.subcategories.map((subcat) => (
              <CategoryAccordion key={subcat.id} category={subcat} />
            ))}
          </div>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

const CategoryList = observer(({ categories }) =>{
  const categoryTree = buildCategoryTree(categories);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Paper
          elevation={3}
          sx={{
            width: "fit-content",
            minWidth: "250px",
            maxWidth: "500px",
            boxShadow: "none",
          }}
        >
          {categoryTree.map((category) => (
            <CategoryAccordion key={category.id} category={category} />
          ))}
        </Paper>
      </Box>
    </ThemeProvider>
  );
});

export default CategoryList;
